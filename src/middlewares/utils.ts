import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';
import {
	TokenExpiredError,
	InvalidTokenError,
} from '../middlewares/errors/globalError';
import { UserTokenInfoType, tokenCertificationType } from '../global';

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
				jwt.verify(token, JWT_SECRET);
			} catch (error: any) {
				switch (error.name) {
					case 'TokenExpiredError':
						return ctx.app.emit('info', TokenExpiredError, ctx, 401);
					case 'JsonWebTokenError':
						return ctx.app.emit('info', InvalidTokenError, ctx, 401);
				}
			}
			const { account, status } = jwt.verify(
				token,
				JWT_SECRET
			) as UserTokenInfoType;
		}
		// 这里处理用户信息更改之后，立刻取消修改token的权限
		// ctx.state.userTokenInfo

		await next();
	};
};
export { tokenCertification };
