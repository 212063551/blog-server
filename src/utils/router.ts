'use strict';

import fs from 'fs';
import path from 'path';
import Router from 'koa-router';
import { DefaultContext, DefaultState, ParameterizedContext } from 'koa';

const routersFolderPath = path.join(__dirname, '../routers');

// 自动加载路由
export const AutoLoadRoutes = (
	router: Router<
		DefaultState,
		ParameterizedContext<DefaultState, DefaultContext>
	>
) => {
	fs.readdirSync(routersFolderPath).forEach((file) => {
		if (file.endsWith('.ts') || file.endsWith('.js')) {
			const route = require(`${routersFolderPath}/${file}`).default;
			router.use(route.routes());
		}
	});
};
