'use strict';

import mongoose from 'mongoose';
import { TIME_ZONE_OFFSET } from '../../config/config';

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
	/** 文章分类 */
	categorys: { type: String, required: true },
	createdAt: {
		type: String,
		default: new Date(new Date().getTime() + TIME_ZONE_OFFSET).toISOString(),
	},
	updatedAt: {
		type: String,
		default: new Date(new Date().getTime() + TIME_ZONE_OFFSET).toISOString(),
	},
});
CategorySchema.pre('findOneAndUpdate', function (next) {
	this.set({
		updatedAt: new Date(new Date().getTime() + TIME_ZONE_OFFSET).toISOString(),
	});
	next();
});

const Categorys = mongoose.model('Categorys', CategorySchema);

export default Categorys;
