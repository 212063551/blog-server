const data = {
	//  用户模块错误 10** 开头

	/** 缺少必需的参数 */
	MissingRequiredError: {
		status: '0',
		info: 'MISSING_REQUIRED_PARAMS',
		infocode: '1001',
	},
	/** 用户名称不符合规范 */
	NameFormatError: {
		status: '0',
		info: 'USERNAME_NON_COMPLIANT',
		infocode: '1002',
	},
	/** 密码不符合规范 */
	PasswordFormatError: {
		status: '0',
		info: 'PASSWORD_NOT_SPECIFICATION',
		infocode: '1003',
	},
	/** 邮箱不符合规范 */
	EmailFormatError: {
		status: '0',
		info: 'EMAIL_NOT_SPECIFICATION',
		infocode: '1004',
	},
	/** 头像存储的url 链接超出规范 */
	AvatarLengthError: {
		status: '0',
		info: 'AVATAR_FONT_LENGTH',
		infocode: '1005',
	},
	/** 用户简介内容超出规范 */
	UserIntroductionError: {
		status: '0',
		info: 'INTRODUCTION_NOT_SPECIFICATION',
		infocode: '1006',
	},
	/** 账号生成出错 */
	AccountGenerationError: {
		status: '0',
		info: 'ACCOUNT_GENERATION_ERROR',
		infocode: '1007',
	},
	/** 邮箱已被其他用户占用 */
	UserMailboxExistsError: {
		status: '0',
		info: 'MAILBOX_OCCUPIED',
		infocode: '1008',
	},
	/** 注册错误 */
	RegisterError: {
		status: '0',
		info: 'REGISTRATION_ERROR',
		infocode: '1009',
	},
	/** 输入不是有效的账号或邮箱 */
	AccountJudgmentError: {
		status: '0',
		info: 'ACCOUNT_JUDGMENT_ERROR',
		infocode: '1010',
	},
	/** 账号不存在 */
	FindAccountError: {
		status: '0',
		info: 'ACCOUNT_DOES_NOT_EXIST',
		infocode: '1011',
	},
	/** 登录密码错误 */
	LoginPassWordError: {
		status: '0',
		info: 'PASSWORD_ERROR',
		infocode: '1012',
	},
	/** 查询所有用户错误 */
	QueryAllUsersError: {
		status: '0',
		info: 'QUERY_All_USERES_ERROR',
		infocode: '1013',
	},
	/** 用户登录错误 */
	LoginError: {
		status: '0',
		info: 'LOGIN_ERROR',
		infocode: '1014',
	},

	// 文章模块错误 11** 开头

	/** 查询所有文章错误 */
	AllarticleError: {
		status: '0',
		info: ' QUERY_ALL_ARTICLES_ERROR',
		infocode: '1101',
	},

	// 30** 开头均为令牌类错误

	/** 令牌过期错误 */
	TokenExpiredError: {
		status: '0',
		info: 'TOKEN_EXPIRATION_ERROR',
		infocode: '3000',
	},
	/** 无效的令牌错误 */
	InvalidTokenError: {
		status: '0',
		info: 'INVALID_TOKEN_ERROR',
		infocode: '3001',
	},
	/** 刷新令牌错误 */
	RefreshTokenError: {
		status: '0',
		info: 'REFRESH_TOKEN_ERROR',
		infocode: '3002',
	},

	// 30** 开头均为数据库类错误

	/** 邮件发送失败 */
	SendMailError: {
		status: '0',
		info: 'SEND_MAIL_ERROR',
		infocode: '3000',
	},

	// 40** 开头均为数据库类错误

	/** 数据库查询错误 */
	DatabaseQueryError: {
		status: '0',
		info: 'DATABASE_QUERY_ERROR',
		infocode: '4000',
	},

	// 50** 开头均为权限错误

	/** 当前登录用户无权限 */
	UserNoPermissionError: {
		status: '0',
		info: 'USER_NO_PERMISSION',
		infocode: '5000',
	},
	/** 用户权限已被变更*/
	UserPermissionsBeenChanged: {
		status: '0',
		info: 'USER_PERMSSIONS_BEEN_CHANGED',
		infocode: '5001',
	},
	/** 管理员没有权限修改其他管理员账号 */
	AdministratorPermissionsError: {
		status: '0',
		info: 'ADMIN_NO_PERMISSION',
		infocode: '5002',
	},
};

export = data;
