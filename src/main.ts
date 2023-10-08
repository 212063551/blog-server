'use strict';

import chalk from 'chalk';
import server from './bin/www';
import { PORT } from './config/config';
import { error } from 'console';
import { MongoConnect, redis } from './db/db';

server.listen(PORT, () => {
	error(
		chalk.green(`
[ncxicn] 服务启动
[ncxicn] 监听运行端口: ${PORT}
		`)
	);
	MongoConnect(), redis;
});
