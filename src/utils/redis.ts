import { redis } from '../db/db';

/**
 * 向redis中定时存储数据
 * @param {string} key redis 键
 * @param {any} value redis 值
 * @param {any} deadline redis 过期时间 不设置默认为永久
 */
const setRedis = async (key: string, value: any, deadline: any) => {
	return await redis.set(key, value, (error, data) => {
		redis.expire(key, deadline);
		if (error) {
			return error;
		}
		return data;
	});
};
/**
 * 向redis 递减 key 对应的 value 值
 * @param {string} key redis 键
 * @returns 返回 递减后的 key 对应的 value 值
 */
const decrRedis = async (key: string) => {
	return await redis.decr(key, (error, result) => {
		if (error) {
			return error;
		}
		return result;
	});
};
/**
 * 查询 key 过期时间
 * @param {string} key redis 键
 * @returns 返回对应 key 的过期时间。
 */
const ttlRedis = async (key: string) => {
	return await redis.ttl(key, (error, result) => {
		if (error) {
			return error;
		}
		return result;
	});
};
/**
 *  用于判断key是否过期
 * @param {string} key
 * @returns key 已过期返回 false ，反之返回 true
 */
const queryRedis = async (key: string) => {
	const result = await redis.exists(key);
	if (result === 0) {
		return false;
	}
	return Boolean(result);
};
/**
 * 获取 rides 库中该 Key 的 value
 * @param {string} key
 * @returns Key 对应 的 value
 */
const getRedis = async (key: string) => {
	const result = await redis.get(key);
	if (result === null) {
		return null;
	}
	return result;
};
export { setRedis, ttlRedis, queryRedis, getRedis, decrRedis };
