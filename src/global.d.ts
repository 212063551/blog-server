import { type } from 'os';

/**
 * 访问Token里存储的内容
 */
interface UserTokenInfoType {
	/**
	 * 用户账号
	 */
	account;
	/**
	 * 用户哈希值，用于计算用户是否变更了内容
	 */
	UserHash;
}
/**
	 用户注册传入值类型
	 */
interface RegisterValueType {
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
	avatarUrl?: string;
	/**
	 * 用户简介
	 */
	introduction?: string;
	/**
	 * 帐户,由系统自动生成。
	 */
	account: string;
}
/**
 * 用户接口返回值类型
 */
interface RegisterReturnType {
	/**
	 *数据是否操作成功
	 */
	state: boolean;
	/**
	 * 成功返回值 返回成功数据
	 */
	data?: RegisterValueType | undefined;
	/**
	 * 失败返回值 返回失败数据
	 */
	error?: unknown;
}
/**
 *  用户搜索关键词类型
 */
interface QueryKeywordType {
	/**
	 *  搜素关键词类型
	 */
	keyword?: string | any;
	page: number;
	limit: number;
}
/**
 * 自动刷新令牌类型
 */
interface AutoRefreshTokenType {
	/**
	 * 帐户
	 */
	account: number;
}
/**
 * 邮箱传入值类型
 */
interface MailboxValueType {
	/**
	 * 邮箱标题
	 */
	mailboxTitle?: string | undefined;
	/**
	 * 发件人
	 */
	sender?: string;
	/**
	 * 收件人
	 */
	recipient?: string;
	/**
	 * 邮件主题
	 */
	subject?: string;
	/**
	 * 邮件 HTML 内容
	 */
	html?: string;
	/**
	 * 邮件 TEXT 内容
	 */
	text?: string;
}

/**
 * 令牌认证
 */
export type tokenCertificationType = {
	/**
	 * 需要忽略的路由，注意如果有前缀，记得带上路由前缀
	 * @param {string | string[] } exclude
	 */
	exclude: string | string[];
};
type ItemKey = number | string;
