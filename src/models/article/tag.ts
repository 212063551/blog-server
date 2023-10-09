'use strict';

import mongoose from 'mongoose';
import { TIME_ZONE_OFFSET } from '../../config/config';

const Schema = mongoose.Schema;

const TagSchema = new Schema({
	/** 文章标签 */
	tag: { type: [String], required: true },
	createdAt: {
		type: String,
		default: new Date(new Date().getTime() + TIME_ZONE_OFFSET).toISOString(),
	},
	updatedAt: {
		type: String,
		default: new Date(new Date().getTime() + TIME_ZONE_OFFSET).toISOString(),
	},
});
TagSchema.pre('findOneAndUpdate', function (next) {
	this.set({
		updatedAt: new Date(new Date().getTime() + TIME_ZONE_OFFSET).toISOString(),
	});
	next();
});

const Tags = mongoose.model('Tags', TagSchema);

export default Tags;
