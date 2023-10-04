import Router from 'koa-router';
const router = new Router({ prefix: '/' });
import {
	queryAllUsers,
	queryUsers,
	register,
	login,
	reviseUsers,
	strikeUsers,
} from '../controllers/users';
import {
	userCheck,
	userMailboxExists,
	passwordEncryption,
	accountJudgment,
	userExists,
	passwordVerification,
	manageLicenses,
} from '../middlewares/users';

/**
 * @public
 * 查询全部用户
 * @param {number} pageSize - 当前页码，默认 1
 * @param {number} pageCurrent - 每页显示的数量，默认 10
 */
router.get('queryallusers', manageLicenses, queryAllUsers);

/**
 * @public
 *【 路由 】- 根据关禁词查询用户
 * @param {number} pageSize - 当前页码，默认 1
 * @param {number} pageCurrent - 每页显示的数量，默认 10
 * @param {string} keyword - 当前页码，默认 1
 */
router.post('queryusers', manageLicenses, queryUsers);

/**
 * @public
 *【 路由 】- 用户注册
 * @param {number} nickname - 页码
 * @param {number} password - 用户密码
 * @param {string} email - 用户邮箱
 * @param {string} avatarUrl - [可选] 用户头像url
 * @param {string} introduction -[可选] 用户介绍
 */
router.post(
	'register',
	userCheck,
	userMailboxExists,
	passwordEncryption,
	register
);

/**
 * @public
 *【 路由 】- 用户登录
 * @param {number} account - 账号 / 邮箱 系统自动判断
 * @param {number} password - 用户密码
 */
router.post('login', accountJudgment, userExists, passwordVerification, login);

/**
 * 修改用户信息
 */
router.put('reviseusers', reviseUsers);

/**
 * 删除用户
 */
router.delete('strikeusers', strikeUsers);

export default router;
