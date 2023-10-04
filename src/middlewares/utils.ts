import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, REFRESH_JWT_SECRET } from '../config/config';
import {
	RefreshTokenError,
	TokenExpiredError,
	InvalidTokenError,
} from '../middlewares/errors/globalError';
import { tokenCertificationType, tokenDecodedType } from '../global';

/** 自动刷新令牌 */
const autoRefreshToken = async (ctx: Context, next: Next) => {
	const refreshToken = ctx.headers['x-refresh-token'] as string;
	if (refreshToken) {
		try {
			const { id, nickname } = jwt.verify(
				refreshToken,
				REFRESH_JWT_SECRET
			) as tokenDecodedType;
			const accessToken = jwt.sign({ id, nickname }, REFRESH_JWT_SECRET, {
				expiresIn: '30m',
			});
			ctx.set('x-refresh-token', accessToken);
		} catch (err: any) {
			return ctx.app.emit('info', RefreshTokenError, ctx, 401);
		}
	}
	await next();
};
/**
 * 令牌认证
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
		}
		await next();
	};
};
export { autoRefreshToken, tokenCertification };
