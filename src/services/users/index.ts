import chalk from 'chalk';
import jwt from 'jsonwebtoken';
import { Users } from '../../models';
import { QueryKeywordType, RegisterValueType } from '../../global';
import { calculateHash, convertToNormalTime } from '../../utils/utils';
import { JWT_SECRET, REFRESH_JWT_SECRET } from '../../config/config';
import { passwordEncryption } from '../../utils/utils';
import { redis } from '../../db/db';

/**
 * @privateAPI
 *【 服务API 】- 查询全部用户
 * @param {number} page - 页码
 * @param {number} limit - 每页显示的数量
 */
const queryAllUsersAPI = async ({
	page,
	limit,
}: {
	page: number;
	limit: number;
}) => {
	try {
		/** 使用聚合管道查询用户并进行分页 */
		const [usersInfoData, totalDocuments] = await Promise.all([
			Users.aggregate([
				{ $skip: (page - 1) * limit },
				{ $limit: limit },
				{ $match: {} },
				{
					$project: {
						nickname: 1,
						account: 1,
						email: 1,
						status: 1,
						avatarUrl: 1,
						introduction: 1,
						createdAt: 1,
						updatedAt: 1,
					},
				},
			]),
			Users.aggregate([{ $count: 'count' }]),
		]);
		const userInfo = usersInfoData.map((item, i) => {
			item.createdAt = convertToNormalTime(item.createdAt);
			item.updatedAt = convertToNormalTime(item.updatedAt);
			return item;
		});
		const total = totalDocuments[0]?.count || 0;
		return { state: true, data: { total, rows: userInfo } };
	} catch (error) {
		console.error(chalk.red(error));
		return { state: false, error };
	}
};

/**
 * @privateAPI
 *【 服务API 】- 根据关键词查询用户
 * @param {number} page - 页码
 * @param {number} limit - 每页显示的数量
 * @param {string | undefined } keyword - 每页显示的数量
 */
const queryUsersAPI = async ({ keyword, page, limit }: QueryKeywordType) => {
	try {
		const regex = new RegExp(keyword, 'i'); // 创建正则表达式，忽略大小写
		const [usersInfoData, totalDocuments] = await Promise.all([
			Users.aggregate([
				{
					$match: {
						$or: [
							{ nickname: { $regex: regex } },
							{ account: { $regex: regex } },
							{ email: { $regex: regex } },
							{ admin: { $regex: regex } },
							{ introduction: { $regex: regex } },
						],
					},
				},
				{ $skip: (page - 1) * limit },
				{ $limit: limit },
				{
					$project: {
						nickname: 1,
						account: 1,
						email: 1,
						admin: 1,
						avatarUrl: 1,
						introduction: 1,
						createdAt: 1,
						updatedAt: 1,
					},
				},
			]),
			Users.aggregate([
				{
					$match: {
						$or: [
							{ nickname: { $regex: regex } },
							{ account: { $regex: regex } },
							{ email: { $regex: regex } },
							{ admin: { $regex: regex } },
							{ introduction: { $regex: regex } },
						],
					},
				},
				{
					$project: {
						nickname: 1,
						account: 1,
						email: 1,
						admin: 1,
						avatarUrl: 1,
						introduction: 1,
						createdAt: 1,
						updatedAt: 1,
					},
				},
				{ $count: 'count' },
			]),
		]);
		const userInfo = usersInfoData.map((item) => {
			item.createdAt = convertToNormalTime(item.createdAt);
			item.updatedAt = convertToNormalTime(item.updatedAt);
			return item;
		});
		const total = totalDocuments[0]?.count || 0;
		return { state: true, data: { total, rows: userInfo } };
	} catch (error) {
		console.error(chalk.red(error));
		return { state: false, error };
	}
};

/**
 * @privateAPI
 *【 服务API 】- 用户注册
 * @param {number} nickname - 页码
 * @param {number} password - 用户密码
 * @param {string} email - 用户邮箱
 * @param {string} avatarUrl - [可选] 用户头像url
 * @param {string} introduction -[可选] 用户介绍
 * @param {string} account - 系统自动生成
 */
const registerAPI = async ({
	nickname,
	password,
	email,
	avatarUrl,
	introduction,
	account,
}: RegisterValueType) => {
	try {
		const newUser = new Users({
			nickname,
			account,
			password,
			email,
			avatarUrl,
			introduction,
		});
		return { state: true, data: await newUser.save() };
	} catch (error) {
		console.error(chalk.red(error));
		return { state: false, error };
	}
};

/**
 * @privateAPI
 *【 服务API 】- 用户登录
 * @param {object} userInfo - 由查询用户中间件获取
 */
const loginAPI = async ({ userInfo }: { userInfo: any }) => {
	try {
		const { _id, __v, password, ...user } = userInfo;

		const accessToken = jwt.sign({ account: user.account }, JWT_SECRET, {
			expiresIn: '30m',
		});
		const refreshToken = jwt.sign(
			{ account: user.account },
			REFRESH_JWT_SECRET,
			{
				expiresIn: '7h',
			}
		);

		return {
			state: true,
			data: { accessToken, refreshToken },
		};
	} catch (error) {
		console.error(chalk.red(error));
		return { state: false, error };
	}
};
/**
 * @privateAPI
 *【 服务API 】- 修改密码
 */
const revisePasswordAPI = async ({
	newPassword,
	account,
}: {
	newPassword: string;
	account: string;
}) => {
	try {
		const data = await Users.findOneAndUpdate(
			{ account },
			{ $set: { password: passwordEncryption(newPassword) } },
			{ returnOriginal: false }
		);
		return { state: true, data };
	} catch (error) {
		console.error(chalk.red(error));
		return { state: false, error };
	}
};

/**
 * @privateAPI
 *【 服务API 】- 修改用户信息
 */
const reviseUsersAPI = async ({
	nickname,
	email,
	avatarUrl,
	introduction,
	account,
}: {
	nickname: string;
	email: string;
	avatarUrl: string;
	introduction: string;
	account: string;
}) => {
	try {
		const data = await Users.findOneAndUpdate(
			{ account },
			{ $set: { nickname, email, avatarUrl, introduction } },
			{ returnOriginal: false }
		);
		return { state: true, data };
	} catch (error) {
		console.error(chalk.red(error));
		return { state: false, error };
	}
};

/**
 * @privateAPI
 *【 服务API 】- 删除用户
 */
const strikeUsersAPI = async ({ account }: { account: string }) => {
	const { acknowledged } = await Users.deleteMany({ account });
	try {
		return { state: true, data: acknowledged };
	} catch (error) {
		console.error(chalk.red(error));
		return { state: false, error };
	}
};

export {
	queryAllUsersAPI,
	queryUsersAPI,
	registerAPI,
	loginAPI,
	reviseUsersAPI,
	strikeUsersAPI,
	revisePasswordAPI,
};
