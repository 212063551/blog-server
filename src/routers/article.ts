import Router from 'koa-router';
const router = new Router({ prefix: '/' });
import {
	allarticle,
	queryarticle,
	addarticle,
	revisearticle,
	deletearticle,
} from '../controllers/article';

/**
 * @public
 * 查询全部文章
 */
router.get('allarticle', allarticle);

/**
 * @public
 *【 路由 】- 根据关禁词查询文章
 * @param {number} pageSize - 当前页码，默认 1
 * @param {number} pageCurrent - 每页显示的数量，默认 10
 * @param {string} keyword - 关键词
 */
router.post('queryarticle', queryarticle);

/**
 * @public
 *【 路由 】- 添加文章
 */
router.post('addarticle', addarticle);

/**
 * @public
 *【 路由 】- 修改文章
 */
router.put('revisearticle', revisearticle);

/**
 * @public
 *【 路由 】- 删除文章
 */
router.delete('deletearticle', deletearticle);

export default router;
