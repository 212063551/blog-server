'use strict';

import mongoose from 'mongoose';
import Redis from 'ioredis';
import {
	MongDB_PWD,
	MongDB_IP,
	MongDB_PORT,
	MongDB_USER,
	MAX_RETRIES,
	REDIS_PORT,
	REDIS_PASSWORD,
} from '../config/config';
import chalk from 'chalk';

const MongDB_HOST = `mongodb://${MongDB_USER}:${MongDB_PWD}@${MongDB_IP}:${MongDB_PORT}/${MongDB_USER}`;

let retryCount: number = 0;
/** 连接mongdb数据库 */
const MongoConnect = () => {
	mongoose.connect(MongDB_HOST);
	mongoose.Promise = global.Promise;
	const db = mongoose.connection;
	db.once('open', () => {
		console.error(`${chalk.blue('[mongodb] 数据库已正常连接')}`);
		/** 连接成功后重置重试计数器 */
		retryCount = 0;
	});
	db.on('error', (error) => {
		console.error(`${chalk.red('[mongodb] 连接出错', error)}`);
		if (retryCount < MAX_RETRIES) {
			/** 增加重试计数器 */
			retryCount++;
			console.error(
				chalk.yellow(`[mongodb] 正在进行第 ${retryCount} 次重试...`)
			);
			setTimeout(() => {
				mongoose.connect(MongDB_HOST);
			}, 3000);
		} else {
			console.error(chalk.red('[mongodb] 重试次数已达上限，停止重试'));
			throw new Error('无法连接到 MongoDB');
		}
	});
	db.on('close', () => {
		console.log(chalk.red('[mongodb] 数据库断开，重新连接数据库'));
		mongoose.connect(MongDB_HOST);
	});
	return db;
};

/** 连接redis */
const redis = new Redis({
	/** redis服务器默认端口号 */
	port: REDIS_PORT,
	/** redis服务器的IP地址 */
	host: MongDB_IP,
	/** redis服务器的密码 */
	password: REDIS_PASSWORD,
	db: 0,
});
redis.on('connecting', () => {
	console.error(`${chalk.yellow('[redis] 正在连接中...')}`);
});
redis.on('connect', () => {
	console.error(`${chalk.blue('[redis] Redis已正常连接')}`);
});
redis.on('error', (error) => {
	console.error(`${chalk.red('[redis] Redis连接出错', error)}`);
	if (retryCount < MAX_RETRIES) {
		/** 增加重试计数器 */
		retryCount++;
		console.error(chalk.yellow(`[redis] 正在进行第 ${retryCount} 次重试...`));
		setTimeout(() => {
			redis.connect();
		}, 3000);
	} else {
		console.error(chalk.red('[mongodb] 重试次数已达上限，停止重试'));
		throw new Error('无法连接到 MongoDB');
	}
});
redis.on('close', () => {
	console.error(`${chalk.yellow('[redis] 连接断开，重新连接')}`);
	redis.connect();
});

export { MongoConnect, redis };
