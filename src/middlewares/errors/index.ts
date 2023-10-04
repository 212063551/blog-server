import { Context } from 'koa';

const errorHandler = (
	err: {
		status: string;
		info: string;
		infocode: string;
	},
	ctx: Context,
	code: number = 500
) => {
	interface ErrorMap {
		[code: number]: { status: number; msg: string };
	}
	const errorMap: ErrorMap = {
		/** 请求错误 */
		400: { status: 400, msg: 'REQUEST_ERROR' },
		/** 未经授权 */
		401: { status: 401, msg: 'UNAUTHORIZED' },
		/** 拒绝请求 */
		403: { status: 403, msg: 'REJECTS_REQUEST' },
		/** 未找到请求 */
		404: { status: 404, msg: 'REQUEST_NOT_FOUND' },
		/** 请求超时 */
		408: { status: 408, msg: 'REQUEST_TIMEOUT' },
		/** 请求次数过多 */
		409: { status: 409, msg: 'TOO_MANY_REQUEST' },
	};
	/** 服务器内部错误 */
	const defaultError: { status: number; msg: string } = {
		status: 500,
		msg: 'INTERNAL_SERVER_ERROR',
	};
	const { status } = errorMap[code] || defaultError;

	ctx.status = status;
	ctx.body = err;
};

export { errorHandler };
