'use strict';

import chalk from 'chalk';
import server from './bin/www';
import { PORT } from './config/config';
import MongoConnect from './mongodb/db';

MongoConnect();

server.listen(PORT, () => {
	console.error(
		chalk.green(
			`
${chalk.blue('[ncxicn]')} 服务启动
${chalk.blue('[ncxicn]')} 监听运行端口: ${PORT}
		`
		)
	);
});
