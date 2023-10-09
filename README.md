# 前端技术宅网站后端接口 v1 版本

技术栈： koa + mongdb + typescript

### 开发规范

所有 API 均遵守以下规则

- 查询全部 `all`
- 关键字查询 `query`
- 添加 `add`
- 修改 `revise`
- 删除 `delete`

### 运行配置

我们需要一些简单的步骤来保证您能正常运行此项目

```sh
# 创建一个文件夹放置项目
mkdir server
# 将入此文件夹
cd server
# 从仓库克隆项目
git clone https://github.com/212063551/blog-server.git
```

您需要再 src 目录下的 config 文件里创建一个 `config.ts` 文件。

```sh
# 您可在终端此项目目录下中执行以下命令，会帮您快速创建一个 config.ts 文件
$ touch src/config/config.ts
```

文件内容如下：

```ts
const data = {
	/** mongdb密码 */
	MongDB_PWD: '',
	/** mongdb需要连接的表 */
	MongDB_USER: '',
	/** mongdb的IP */
	MongDB_IP: '',
	/** mongdb运行端口 默认：27017 */
	MongDB_PORT: 27017,
	/** mongdb连接失败之后最大重试次数 默认为5次 */
	MAX_RETRIES: 5,
	/** 默认生成验证码的长度 （ 预留 ） */
	CAPTCHA_LENGTH: 6,
	/** 限制上传文件的大小 默认 2M （ 预留 ）*/
	MAX_FILLE_SIZE: 2 * 1024 * 1024,
	/** 设置上传文件放置的目录 默认放置在项目根目录下的 public 文件夹中 */
	UPLOAD_DIRECTORY: '../public',
	/** 项目运行端口 */
	PORT: 8000,
	/** 访问Token需要加的“盐” */
	JWT_SECRET: '',
	/** 刷新Token需要加的“盐” */
	REFRESH_JWT_SECRET: '',
	/** JWT的过期时间  */
	EXPIRES_IN: '30m',
	/** 数据库使用到 东八区   */
	TIME_ZONE_OFFSET: 8 * 60 * 60 * 1000,
};
export = data;
```

```sh
# 安装依赖
yarn
# 运行项目
yarn start:dev

# 终端输出以下内容则项目正常运行
[ncxicn] 服务启动
[ncxicn] 监听运行端口: 8000
[mongodb] 数据库已正常连接
```

项目预计开发接口

##### 用户模块

- [x] 全部用户查询
- [x] 查询指定用户（ 模糊查询 ）
- [x] 用户注册
- [x] 用户登录
- [x] 修改用户信息
- [x] 删除用户

#### 文章模块

- [ ] 全部文章查询
- [ ] 查询指定文章（ 模糊查询 ）
- [ ] 创建文章
- [ ] 修改文章
- [ ] 删除文章
- [ ] 文章回收站

待定中...
