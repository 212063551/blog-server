import { Context } from 'koa';
import chalk from 'chalk';
import { Users } from '../../models';
import {
	registerAPI,
	queryAllUsersAPI,
	queryUsersAPI,
	loginAPI,
	revisePasswordAPI,
	reviseUsersAPI,
	strikeUsersAPI,
} from '../../services/users';
import {
	RegisterError,
	QueryAllUsersError,
	LoginError,
	FindAccountError,
	AdministratorPermissionsError,
} from '../../middlewares/errors/globalError';
import { success } from '../../utils/utils';
import { passwordEncryption } from '../../utils/utils';
import { RegisterReturnType, RegisterValueType } from '../../global';

/**
 * @privateAPI
 *【 服务 】- 查询全部用户
 */
const queryAllUsers = async (ctx: Context) => {
	const { state, data, error } = await queryAllUsersAPI();
	if (state) {
		return (ctx.body = success({ data }));
	} else {
		console.error(chalk.red(error));
		return ctx.app.emit('info', QueryAllUsersError, ctx);
	}
};

/**
 * @privateAPI
 *【 服务 】- 根据关键词查询用户
 */
const queryUsers = async (ctx: Context) => {
	const { keyword, pageSize, pageCurrent } = ctx.request.query;
	const { data, state, error } = await queryUsersAPI({
		keyword,
		page: Number(pageSize),
		limit: Number(pageCurrent),
	});
	if (state) {
		return (ctx.body = success({ data }));
	} else {
		console.error(chalk.red(error));
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
	const { data, state, error }: RegisterReturnType = await registerAPI({
		nickname,
		account,
		password: passwordEncryption(password),
		email,
		avatarUrl,
		introduction,
	});
	if (state) {
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
	const { data, state, error } = (await loginAPI({
		userInfo: ctx.state.userInfo._doc,
	})) as any;

	if (state) {
		ctx.set('x-refresh-token', data.accessToken);
		return (ctx.body = success({ data: [data] }));
	} else {
		console.error(chalk.red(error));
		return ctx.app.emit('info', LoginError, ctx);
	}
};

/**
 * @privateAPI
 *【 服务 】- 修改密码
 */
const revisePassword = async (ctx: Context) => {
	const { newPassword, account } = ctx.request.body;
	//判断当前登录用户是否为管理员
	if (ctx.state.userInfo.admin === true) {
		// 是管理员且 account 字段存在则认为修改其他用户的密码
		if (account) {
			// 判断传入账户是否存在
			const user = await Users.findOne({ account });
			// 判断传入账户是否为管理员
			if (user?.account) {
				if (user?.admin !== true) {
					ctx.state.NewAccount = account;
				} else {
					return ctx.app.emit('info', AdministratorPermissionsError, ctx);
				}
			} else {
				return ctx.app.emit('info', FindAccountError, ctx);
			}
		} else {
			// 是管理员且 account 字段不存在则认为修改当前登录者的密码
			ctx.state.NewAccount = ctx.state.userInfo.account;
		}
	} else {
		ctx.state.NewAccount = ctx.state.userInfo.account;
	}
	const { state, error } = await revisePasswordAPI({
		newPassword,
		account: ctx.state.NewAccount,
	});
	if (state) {
		return (ctx.body = success({ data: state }));
	} else {
		console.error(chalk.red(error));
		return ctx.app.emit('info', LoginError, ctx);
	}
};

/**
 * @privateAPI
 *【 服务 】- 修改用户信息
 */
const reviseUsers = async (ctx: Context) => {
	const { nickname, email, avatarUrl, introduction } = ctx.request.body;
	const { data, state, error } = await reviseUsersAPI({
		nickname,
		email,
		avatarUrl,
		introduction,
		account: ctx.state.userInfo.account,
	});
	if (state) {
		return (ctx.body = success({ data: state }));
	} else {
		console.error(chalk.red(error));
		return ctx.app.emit('info', LoginError, ctx);
	}
};

/**
 * @privateAPI
 *【 服务 】- 删除用户
 */
const deleteUsers = async (ctx: Context) => {
	const { account } = ctx.request.body;
	if (!(await Users.findOne({ account }))) {
		return ctx.app.emit('info', FindAccountError, ctx);
	}
	const { data, state, error } = await strikeUsersAPI({ account });
	if (state) {
		return (ctx.body = success({ data }));
	} else {
		console.error(chalk.red(error));
		return ctx.app.emit('info', LoginError, ctx);
	}
};

export {
	queryAllUsers,
	queryUsers,
	register,
	login,
	reviseUsers,
	deleteUsers,
	revisePassword,
};
