import Koa from 'koa';
import path from 'path';
import cors from '@koa/cors';
import views from 'koa-views';
import Router from 'koa-router';
import staticDir from 'koa-static';
import { AutoLoadRoutes } from '../utils/router';
import { bodyConfig } from '../config/default.config';
import { errorHandler } from '../middlewares/errors';
import { tokenCertification } from '../middlewares/utils';

const server = new Koa();
const router: any = new Router();

/** 装载文件路由 */
AutoLoadRoutes(router);

server.use(cors({}));
server.use(bodyConfig());
server.use(staticDir('./public'));
server.use(
	tokenCertification({ exclude: ['/login', '/register', '/sendcode'] })
);
server.use(views(path.join(__dirname, '../views'), { extension: 'ejs' }));
server.use(router.routes());
server.on('info', errorHandler);

export default server;
