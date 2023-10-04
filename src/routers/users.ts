import Router from 'koa-router';
const router = new Router({ prefix: '/' });
import {
	allUsers,
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
} from '../middlewares/users';

/**
 * @public
 * 查询全部用户
 */
router.get('allusers', allUsers);

/**
 * @public
 * 根据关禁词查询用户
 */
router.post('queryusers', queryUsers);

/**
 * @public
 * 用户注册
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
 * 用户登录
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
