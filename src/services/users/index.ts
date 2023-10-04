import { Context } from 'koa';
import { Users } from '../../models';
import { registerAPIType } from '../../global';

/**
 * @privateAPI
 * 查询全部用户
 */
const allUsersAPI = async () => {
	try {
		const newUser = new Users();
		console.log(newUser);

		return { status: true, data: newUser };
	} catch (error) {
		return { status: false, data: error };
	}
};

/**
 * @privateAPI
 * 根据关键词查询用户
 */
const queryUsersAPI = async ({ keyword }: { keyword: string }) => {
	try {
		const newUser = new Users({
			keyword,
		});
		return { status: true, data: await newUser.save() };
	} catch (error) {
		return { status: false, data: error };
	}
};

/**
 * @privateAPI
 * 用户注册
 */
const registerAPI = async ({
	nickname,
	password,
	email,
	avatarUrl,
	introduction,
	account,
}: registerAPIType) => {
	try {
		const newUser = new Users({
			nickname,
			account,
			password,
			email,
			avatarUrl,
			introduction,
		});
		return { status: true, data: await newUser.save() };
	} catch (error) {
		return { status: false, data: error };
	}
};

/**
 * @privateAPI
 * 用户登录
 */
const loginAPI = async (ctx: Context) => {};

/**
 * @privateAPI
 * 修改用户信息
 */
const reviseUsersAPI = async () => {};

/**
 * @privateAPI
 * 删除用户
 */
const strikeUsersAPI = async () => {};

export {
	allUsersAPI,
	queryUsersAPI,
	registerAPI,
	loginAPI,
	reviseUsersAPI,
	strikeUsersAPI,
};
