import Router from 'koa-router';
const router = new Router({ prefix: '/' });
import {
	queryAllUsers,
	queryUsers,
	register,
	login,
	reviseUsers,
	deleteUsers,
	revisePassword,
} from '../controllers/users';
import {
	userCheck,
	userMailboxExists,
	accountJudgment,
	userExists,
	passwordVerification,
	manageLicenses,
	passwordFormat,
	userValueCheck,
	pagination,
} from '../middlewares/users';

/**
 * @public
 * 查询全部用户
 */
router.get('allusers', manageLicenses, queryAllUsers);

/**
 * @public
 *【 路由 】- 根据关禁词查询用户
 * @param {number} pageSize - 当前页码，默认 1
 * @param {number} pageCurrent - 每页显示的数量，默认 10
 * @param {string} keyword - 关键字
 */
router.post('queryusers', manageLicenses, pagination, queryUsers);

/**
 * @public
 *【 路由 】- 用户注册
 * @param {number} nickname - 用户名
 * @param {number} password - 用户密码
 * @param {string} email - 用户邮箱
 * @param {string} avatarUrl - [可选] 用户头像url
 * @param {string} introduction -[可选] 用户介绍
 */
router.post('register', userCheck, userMailboxExists, register);

/**
 * @public
 *【 路由 】- 用户登录
 * @param {number} account - 账号 / 邮箱 系统自动判断
 * @param {number} password - 用户密码
 */
router.post('login', accountJudgment, userExists, passwordVerification, login);

/** 暂不开发忘记密码功能，如如需密码变更，请联系管理员 */

/**
 * @public
 *【 路由 】- 修改密码
 * @param {number} newPassword - 新密码
 * @param {string} password - 原密码
 * @param {string} account - 账号 注意：只有管理员权限传入的值才有效，非管理默认使用当前登录用户的token 里的值
 */
router.patch(
	'revisepassword',
	passwordFormat,
	passwordVerification,
	revisePassword
);

/**
 * @public
 *【 路由 】- 修改用户信息
 * @param {number} nickname - 用户名
 * @param {string} email - 用户邮箱
 * @param {string} avatarUrl - 用户头像url
 * @param {string} introduction - 用户介绍
 */
router.put('reviseusers', userValueCheck, userMailboxExists, reviseUsers);

/**
 * @public
 *【 路由 】- 删除用户信息
 * @param {string｜string[] } account - 账号
 */
router.delete('deleteusers', manageLicenses, deleteUsers);

export default router;
