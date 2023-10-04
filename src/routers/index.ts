import Router from 'koa-router';
const router = new Router({ prefix: '/' });

router.get('', async (ctx, next) => {
	ctx.body = '当前服务正在运行';
});

export default router;
