import { Context } from 'koa';
import chalk from 'chalk';
import {
	registerAPI,
	queryAllUsersAPI,
	queryUsersAPI,
	loginAPI,
} from '../../services/users';
import {
	RegisterError,
	QueryAllUsersError,
	LoginError,
} from '../../middlewares/errors/globalError';
import { success } from '../../utils/utils';
import { RegisterValueType, RegisterReturnType } from '../../global';

/**
 * @privateAPI
 *【 服务 】- 查询全部用户
 */
const queryAllUsers = async (ctx: Context) => {
	const { pageSize, pageCurrent } = ctx.request.query;
	const { status, data } = await queryAllUsersAPI({
		page: Number(pageSize),
		limit: Number(pageCurrent),
	});
	if (status) {
		return (ctx.body = success({ data }));
	} else {
		console.error(chalk.red(data));
		return ctx.app.emit('info', QueryAllUsersError, ctx);
	}
};

/**
 * @privateAPI
 *【 服务 】- 根据关键词查询用户
 */
const queryUsers = async (ctx: Context) => {
	const { keyword, pageSize, pageCurrent } = ctx.request.query;
	const { status, data } = await queryUsersAPI({
		keyword,
		page: Number(pageSize),
		limit: Number(pageCurrent),
	});
	if (status) {
		return (ctx.body = success({ data }));
	} else {
		console.error(chalk.red(data));
		return ctx.app.emit('info', QueryAllUsersError, ctx);
	}
};

/**
 * @privateAPI
 *【 服务 】- 用户注册
 */
const register = async (ctx: Context) => {
	const {
		nickname,
		password,
		email,
		avatarUrl,
		introduction,
		account,
	}: RegisterValueType = ctx.request.body;
	const { data, status, error }: RegisterReturnType = await registerAPI({
		nickname,
		account,
		password,
		email,
		avatarUrl,
		introduction,
	});
	if (status) {
		return (ctx.body = success({ data: [{ account: data?.account }] }));
	} else {
		console.error(chalk.red(error));
		return ctx.app.emit('info', RegisterError, ctx);
	}
};

/**
 * @privateAPI
 *【 服务 】- 用户登录
 */
const login = async (ctx: Context) => {
	const { data, status } = (await loginAPI({
		userInfo: ctx.state.userInfo._doc,
	})) as any;

	if (status) {
		ctx.set('x-refresh-token', data.accessToken);
		return (ctx.body = success({ data: [data] }));
	} else {
		console.error(chalk.red(data));
		return ctx.app.emit('info', LoginError, ctx);
	}
};

/**
 * @privateAPI
 *【 服务 】- 修改用户信息
 */
const reviseUsers = async () => {};

/**
 * @privateAPI
 *【 服务 】- 删除用户
 */
const strikeUsers = async () => {};

export { queryAllUsers, queryUsers, register, login, reviseUsers, strikeUsers };
