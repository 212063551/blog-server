import { Context } from 'koa';
import jwt from 'jsonwebtoken';
import { registerAPI, allUsersAPI } from '../../services/users';
import {
	DesensitizeEmail,
	convertToNormalTime,
	success,
} from '../../utils/utils';
import { JWT_SECRET, REFRESH_JWT_SECRET } from '../../config/config';
import { registerError } from '../../middlewares/errors/globalError';
import { registerType } from '../../global';

/**
 * @privateAPI
 * 查询全部用户
 */
const allUsers = async (ctx: Context) => {
	const { data, status } = await allUsersAPI();
	if (status) {
		ctx.body = success({ data: [{ data }] });
	} else {
		return ctx.app.emit('info', registerError, ctx);
	}
};

/**
 * @privateAPI
 * 根据关键词查询用户
 */
const queryUsers = async () => {};

/**
 * @privateAPI
 * 用户注册
 */
const register = async (ctx: Context) => {
	const { nickname, password, email, avatarUrl, introduction, account } =
		ctx.request.body;
	const { data, status } = (await registerAPI({
		nickname,
		account,
		password,
		email,
		avatarUrl,
		introduction,
	})) as registerType;
	if (status) {
		ctx.body = success({ data: [{ account: data.account }] });
	} else {
		return ctx.app.emit('info', registerError, ctx);
	}
};

/**
 * @privateAPI
 * 用户登录
 */
const login = async (ctx: Context) => {
	try {
		const { _id, __v, password, ...user } = ctx.state.userInfo._doc;
		user.createTime = convertToNormalTime(user.createTime);
		user.email = DesensitizeEmail(user.email);
		const accessToken = jwt.sign(user, JWT_SECRET, {
			expiresIn: '30m',
		});
		const refreshToken = jwt.sign(
			{ id: user.account, nickname: user.nickname },
			REFRESH_JWT_SECRET,
			{
				expiresIn: '7h',
			}
		);
		ctx.set('x-refresh-token', accessToken);
		return (ctx.body = success({
			data: { accessToken: accessToken, refreshToken: refreshToken },
		}));
	} catch (error) {
		console.error(error);
	}
};

/**
 * @privateAPI
 * 修改用户信息
 */
const reviseUsers = async () => {};

/**
 * @privateAPI
 * 删除用户
 */
const strikeUsers = async () => {};

export { allUsers, queryUsers, register, login, reviseUsers, strikeUsers };
