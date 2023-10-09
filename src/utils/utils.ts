'use strict';

import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Users } from '../models';
import {
	DatabaseQueryError,
	RefreshTokenError,
} from '../middlewares/errors/globalError';
import { REFRESH_JWT_SECRET } from '../config/config';
import { AutoRefreshTokenType } from '../global';

/** 邮箱的正则表达式 */
const EmailFormat = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
/** 密码的正则表达式 */
const PasswordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,16}$/;
/** 用户名的正则表达式 */
const NameFormat = /^[\u4E00-\u9FA5A-Za-z0-9_]{1,20}$/;
/** 账号的正则表达式 */
const AccountFormat = /^[a-zA-Z0-9_]{11}$/;

/** 成功返回 */
const success = ({ data }: { data?: any | any[] } = {}) => {
	return {
		status: '1',
		info: 'OK',
		infocode: '1000',
		data,
	};
};
/** 账号生成并验证  */
const accountNumber = async (ctx: Context) => {
	const generateAccount = () => {
		/** 生成 5 位随机数字作为前缀 */
		const prefix = generateRandomNumber(10000, 99999);
		/** 生成 6 位随机数字作为后缀 */
		const suffix = generateRandomNumber(100000, 999999);
		/** 拼接前缀和后缀生成最终账号 */
		const account = `${prefix}${suffix}`;
		return account;
	};
	/** 生成指定范围内的随机整数 */
	const generateRandomNumber = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	try {
		const accountExists = await Users.findOne({ account: generateAccount() });
		if (accountExists) {
			return { state: true, msg: generateAccount() };
		} else {
			return { state: true, msg: generateAccount() };
		}
	} catch (error) {
		ctx.app.emit('info', DatabaseQueryError, ctx);
		return { state: false, msg: 'error' };
	}
};
/** 邮箱脱敏 */
const DesensitizeEmail = (
	/** 需要脱敏的邮箱 */
	email: string
) => {
	const atIndex = email.indexOf('@');
	if (atIndex !== -1) {
		const username = email.substring(0, atIndex);
		const desensitizedUsername = username.substring(0, 3) + '****';
		const domain = email.substring(atIndex);
		return desensitizedUsername + domain;
	}
	return email;
};
/** 时间转换 */
const convertToNormalTime = (
	/** 需要转换的 UTC时间 */
	timestamp: string
) => {
	const date = new Date(timestamp);
	const year = date.getFullYear();
	const month = ('0' + (date.getMonth() + 1)).slice(-2);
	const day = ('0' + date.getDate()).slice(-2);
	const hours = ('0' + date.getHours()).slice(-2);
	const minutes = ('0' + date.getMinutes()).slice(-2);
	const seconds = ('0' + date.getSeconds()).slice(-2);
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
/** 自动刷新令牌 */
const autoRefreshToken = async (ctx: Context, next: Next) => {
	const refreshToken = ctx.headers['x-refresh-token'] as string;
	if (refreshToken) {
		try {
			const { account } = jwt.verify(
				refreshToken,
				REFRESH_JWT_SECRET
			) as AutoRefreshTokenType;
			const accessToken = jwt.sign({ account }, REFRESH_JWT_SECRET, {
				expiresIn: '30m',
			});
			ctx.set('x-refresh-token', accessToken);
		} catch (err: any) {
			return ctx.app.emit('info', RefreshTokenError, ctx, 401);
		}
	}
	await next();
};
/** 密码加密存储 */
const passwordEncryption = (
	/** 需要加密的密码 */
	password: string
) => {
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	return hash;
};
/** 计算 Hash值 */
const calculateHash = (
	/** 需要计算的数据 */
	data: any,
	/** 建议使用 sha256 */
	algorithm: string
) => {
	const hash = crypto.createHash(algorithm);
	hash.update(JSON.stringify(data));
	return hash.digest('hex');
};

export {
	EmailFormat,
	PasswordFormat,
	NameFormat,
	AccountFormat,
	success,
	accountNumber,
	DesensitizeEmail,
	convertToNormalTime,
	autoRefreshToken,
	passwordEncryption,
	calculateHash,
};
