import { type } from 'os';

export type tokenCertificationType = {
	/**
	 * 需要忽略的路由，注意如果有前缀，记得带上路由前缀
	 * @param {string | string[] } exclude
	 */
	exclude: string | string[];
};
export type tokenDecodedType = {
	id: string;
	nickname: string;
	iat: number;
	exp: number;
};
export type registerAPIType = {
	/**
	 * 用户昵称
	 * */
	nickname: string;
	/**
	 * 密码
	 */
	password: string;
	/**
	 * 电子邮箱
	 */
	email: string;
	/**
	 * 用户头像
	 */
	avatarUrl: string;
	/**
	 * 用户简介
	 */
	introduction: string;
	/**
	 * 帐户,由系统自动生成。
	 */
	account: string;
};
export type registerType = {
	status: boolean;
	data: registerAPIType;
};
