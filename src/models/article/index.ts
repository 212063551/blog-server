'use strict';

import mongoose from 'mongoose';
import { TIME_ZONE_OFFSET } from '../../config/config';

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
	/** 文章id  */
	article_id: { type: String, required: true },
	/** 文章标题 */
	title: { type: String, required: true },
	/** 文章简介 */
	intro: { type: String, required: true },
	/** 文章封面图片 */
	cover_picture: { type: String, required: true },
	/** 是否启用封面 */
	is_cover: { type: Boolean, required: true },
	/** 文章是否启用 */
	is_enabled: { type: Boolean, required: true },
	/** 文章版权 */
	copyright: { type: Boolean, required: true },
	/** 如果文章是转载的，则需要文章转载来源 */
	reprint: { type: String },
	/** 文章内容 */
	content: { type: String, required: true },
	/** 文章标签 */
	tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tags' }],
	/** 文章分类 */
	category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categorys' }],
	/** 文章是否被软删除？ */
	is_Delete: { type: Boolean, required: true, default: false },
	/** 文章创建于 */
	createdAt: {
		type: String,
		default: new Date(new Date().getTime() + TIME_ZONE_OFFSET).toISOString(),
	},
	/** 文章修改于 */
	updatedAt: {
		type: String,
		default: new Date(new Date().getTime() + TIME_ZONE_OFFSET).toISOString(),
	},
});

ArticleSchema.pre('findOneAndUpdate', function (next) {
	this.set({
		updatedAt: new Date(new Date().getTime() + TIME_ZONE_OFFSET).toISOString(),
	});
	next();
});

const Articles = mongoose.model('Articles', ArticleSchema);

export default Articles;
