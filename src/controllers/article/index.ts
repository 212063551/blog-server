import { Context } from 'koa';
import { Articles, Tags, Categorys } from '../../models';
import {
	allarticleAPI,
	queryarticleAPI,
	addarticleAPI,
	revisearticleAPI,
	softDeleteArticleAPI,
	deletearticleAPI,
} from '../../services/article';
import { AllarticleError } from '../../middlewares/errors/globalError';
import { success } from '../../utils/utils';
import chalk from 'chalk';
import { QueryKeywordType } from '../../global';

/**
 * 查询全部文章
 * @param
 */
const allarticle = async (ctx: Context) => {
	const { state, error, data } = await allarticleAPI();
	if (state) {
		ctx.body = success({ data });
	} else {
		console.log(chalk.red(error));
		ctx.app.emit('info', AllarticleError, ctx);
	}
};

/**
 * 根据关键词全部文章
 * @param
 */
const queryarticle = async (ctx: Context) => {
	const { keyword, pageSize, pageCurrent } = ctx.request.query;
	// const { state, error, data } = await queryarticleAPI({});
};

/**
 * 添加文章
 * @param
 */
const addarticle = async (ctx: Context) => {
	// const { state, data, error } = await addarticleAPI({});
};

/**
 * 修改文章
 * @param
 */
const revisearticle = async (ctx: Context) => {};

/**
 * 软删除文章
 * @param
 */
const softDeleteArticle = async (ctx: Context) => {};

/**
 * 硬删除文章
 * @param
 */
const deletearticle = async (ctx: Context) => {};

export {
	allarticle,
	queryarticle,
	addarticle,
	revisearticle,
	softDeleteArticle,
	deletearticle,
};
