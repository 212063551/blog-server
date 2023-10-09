import chalk from 'chalk';
import { ItemKey, QueryKeywordType } from '../../global';
import { Articles, Tags, Categorys } from '../../models';
import { convertToNormalTime } from '../../utils/utils';

/**
 * @private
 * 查询全部文章
 */
const allarticleAPI = async () => {
	try {
		const articles: any = await Articles.find({})
			.populate({
				path: 'tags',
				select: '-_id tag',
			})
			.populate({
				path: 'category',
				select: '-_id categorys',
			})
			.select('-__v -_id')
			.exec();
		const rows = articles.map((article: any, i: ItemKey) => {
			const tags = article.tags[0].tag;
			const category = article.category[0].categorys;
			return { ...article._doc, tags, category };
		});
		return {
			state: true,
			data: { total: rows.length, rows },
		};
	} catch (error) {
		return { state: false, error };
	}
};

/**
 *
 */
const queryarticleAPI = async ({
	keyword,
	page,
	limit,
}: QueryKeywordType) => {};

/**
 *
 */
const addarticleAPI = async () => {};

/**
 *
 */
const revisearticleAPI = async () => {};

/**
 *
 */
const softDeleteArticleAPI = async () => {};

/**
 *
 */
const deletearticleAPI = async () => {};

export {
	allarticleAPI,
	queryarticleAPI,
	addarticleAPI,
	revisearticleAPI,
	softDeleteArticleAPI,
	deletearticleAPI,
};
