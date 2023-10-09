import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { Users } from '../models';
import svgCaptcha from 'svg-captcha';
import chalk from 'chalk';
import { CAPTCHA_LENGTH, JWT_SECRET } from '../config/config';
import {
	TokenExpiredError,
	InvalidTokenError,
	SendMailError,
} from '../middlewares/errors/globalError';
import { UserTokenInfoType, tokenCertificationType } from '../global';
import { InfoEmail } from '../utils/email';
import { success } from '../utils/utils';

/**
 *【 中间件 】- 令牌认证
 * @param  {string | string[] }  exclude 需要忽略的路由，注意如果有前缀，记得带上路由前缀
 */
const tokenCertification = ({ exclude }: tokenCertificationType) => {
	return async (ctx: Context, next: Next) => {
		if (!exclude.includes(ctx.request.url)) {
			const { authorization = '' } = ctx.request.header;
			const token = authorization.replace('Bearer ', '');
			try {
				const { account } = jwt.verify(token, JWT_SECRET) as UserTokenInfoType;
				ctx.state.userInfo = await Users.findOne({ account });
			} catch (error: any) {
				switch (error.name) {
					case 'TokenExpiredError':
						return ctx.app.emit('info', TokenExpiredError, ctx, 401);
					case 'JsonWebTokenError':
						return ctx.app.emit('info', InvalidTokenError, ctx, 401);
				}
			}
		}
		await next();
	};
};

/**
 *【 中间件 】- 发送验证码
 * @param  {string | string[] }  exclude 需要忽略的路由，注意如果有前缀，记得带上路由前缀
 */
const sendVerificationCode = async (ctx: Context) => {
	const { email } = ctx.request.body;
	const code = svgCaptcha.create({
		size: CAPTCHA_LENGTH,
	}).text;
	try {
		const { state, error } = await InfoEmail(email, {
			recipient: email,
			subject: '[ 验证码 ] 验证此邮箱',
			text: `您正在操作进行敏感操作，我们需要验证是您本人操作。 验证码: ${code}`,
		});
		if (state) {
			ctx.body = success();
		} else {
			return ctx.app.emit('info', error, ctx);
		}
	} catch (error) {
		console.error(chalk.red(error));
		return ctx.app.emit('info', SendMailError, ctx);
	}
};
export { tokenCertification, sendVerificationCode };
