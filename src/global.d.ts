/**
 * 用户模块定义
 */
declare namespace UsersType {
	/**
	 * 访问Token里存储的内容
	 */

	interface UserTokenInfoType {
		/**
		 * 用户账号
		 */
		account: string;
		/**
		 * 用户权限
		 */
		status: string;
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
		status: boolean;
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

export = UsersType;
