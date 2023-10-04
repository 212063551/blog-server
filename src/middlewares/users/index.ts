import { Context, Next } from 'koa';
import bcrypt from 'bcryptjs';
import chalk from 'chalk';
import { Users } from '../../models';
import {
	EmailFormat,
	PasswordFormat,
	NameFormat,
	AccountFormat,
	accountNumber,
} from '../../utils/utils';
import {
	MissingRequiredError,
	NameFormatError,
	PasswordFormatError,
	EmailFormatError,
	AvatarLengthError,
	UserIntroductionError,
	AccountGenerationError,
	UserMailboxExistsError,
	AccountJudgmentError,
	FindAccountError,
	LoginPassWordError,
	DatabaseQueryError,
	UserNoPermissionError,
} from '../errors/globalError';

import { UserTokenInfoType } from '../../global';

/**【 中间件 】- 注册传入值检查 */
const userCheck = async (ctx: Context, next: Next) => {
	const { nickname, password, email, avatarUrl, introduction } =
		ctx.request.body;
	const account = await accountNumber(ctx);
	/** 验证必传字段 */
	if (!nickname || !password || !email) {
		return ctx.app.emit('info', MissingRequiredError, ctx);
	} else {
		if (!NameFormat.test(nickname)) {
			return ctx.app.emit('info', NameFormatError, ctx);
		}
		if (!PasswordFormat.test(password)) {
			return ctx.app.emit('info', PasswordFormatError, ctx);
		}
		if (!EmailFormat.test(email)) {
			return ctx.app.emit('info', EmailFormatError, ctx);
		}
	}
	/** 验证可选字段 */
	if (avatarUrl) {
		if (avatarUrl.length > 255) {
			return ctx.app.emit('info', AvatarLengthError, ctx);
		}
	}
	if (introduction) {
		if (introduction.length > 200) {
			return ctx.app.emit('info', UserIntroductionError, ctx);
		}
	}
	if (account.status !== true) {
		return ctx.app.emit('info', AccountGenerationError, ctx);
	}
	ctx.request.body.account = account.msg;
	await next();
};

/**【 中间件 】- 邮箱是否已注册 */
const userMailboxExists = async (ctx: Context, next: Next) => {
	const { email } = ctx.request.body;
	try {
		if (await Users.findOne({ email })) {
			return ctx.app.emit('info', UserMailboxExistsError, ctx);
		}
	} catch (error) {
		console.error(chalk.red(error));
		return ctx.app.emit('info', DatabaseQueryError, ctx);
	}
	await next();
};

/**【 中间件 】- 密码加密存储 */
const passwordEncryption = async (ctx: Context, next: Next) => {
	const { password } = ctx.request.body;
	const salt = bcrypt.genSaltSync(10);
	const hash = bcrypt.hashSync(password, salt);
	ctx.request.body.password = hash;
	await next();
};

/**【 中间件 】- 账户判断 */
const accountJudgment = async (ctx: Context, next: Next) => {
	const { account } = ctx.request.body;
	if (!EmailFormat.test(account)) {
		if (!AccountFormat.test(account)) {
			return ctx.app.emit('info', AccountJudgmentError, ctx);
		} else {
			ctx.state.account = account;
		}
	} else {
		ctx.state.email = account;
	}
	await next();
};

/**【 中间件 】- 用户或邮箱是否存在 */
const userExists = async (ctx: Context, next: Next) => {
	const { email, account } = ctx.state;
	try {
		let user;
		if (email) {
			user = await Users.findOne({ email });
			if (!user || user.email !== email) {
				return ctx.app.emit('info', FindAccountError, ctx);
			}
		} else {
			user = await Users.findOne({ account });
			if (!user || user.account !== account) {
				return ctx.app.emit('info', FindAccountError, ctx);
			}
		}
		ctx.state.userInfo = user;
	} catch (error) {
		console.error(chalk.red(error));
		return ctx.app.emit('info', DatabaseQueryError, ctx);
	}

	await next();
};

/**【 中间件 】- 密码验证 */
const passwordVerification = async (ctx: Context, next: Next) => {
	const { password } = ctx.request.body;
	if (bcrypt.compareSync(password, ctx.state.userInfo.password) !== true) {
		return ctx.app.emit('info', LoginPassWordError, ctx);
	}
	await next();
};

/**【 中间件 】- 只有管理员权限才运行访问 */
const manageLicenses = async (ctx: Context, next: Next) => {
	const { status } = ctx.state.userTokenInfo as UserTokenInfoType;
	if (status !== 'admin') {
		return ctx.app.emit('info', UserNoPermissionError, ctx);
	}
	await next();
};

export {
	userCheck,
	userMailboxExists,
	passwordEncryption,
	accountJudgment,
	userExists,
	passwordVerification,
	manageLicenses,
};
