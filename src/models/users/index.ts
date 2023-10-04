'use strict';

import mongoose from 'mongoose';
import { TIME_ZONE_OFFSET } from '../../config/config';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	nickname: { type: String, required: true, maxlength: 20, minlength: 1 },
	/** account字段由系统自动生成 */
	account: { type: String, required: true, maxlength: 100 },
	password: { type: String, required: true, maxlength: 255 },
	email: { type: String, required: true, maxlength: 100 },
	status: {
		type: String,
		required: true,
		enum: ['user', 'admin', 'root'],
		default: 'user',
	},
	avatarUrl: { type: String, default: 'default.jpg', maxlength: 255 },
	introduction: { type: String, default: '这里什么也没有...', maxlength: 200 },
	createdAt: {
		type: String,
		default: new Date(new Date().getTime() + TIME_ZONE_OFFSET).toISOString(),
	},
	updatedAt: {
		type: String,
		default: new Date(new Date().getTime() + TIME_ZONE_OFFSET).toISOString(),
	},
});
UserSchema.pre('findOneAndUpdate', function (next) {
	this.set({ updatedAt: new Date() });
	next();
});

const Users = mongoose.model('Users', UserSchema);

export default Users;
