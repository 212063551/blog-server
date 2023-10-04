'use strict';

import koaBody, { HttpMethodEnum } from 'koa-body';
import { UPLOAD_DIRECTORY, MAX_FILLE_SIZE } from './config';
import path from 'path';

const { POST, GET, PUT, PATCH, DELETE } = HttpMethodEnum;

export const bodyConfig = () => {
	return koaBody({
		multipart: true,
		formidable: {
			uploadDir: path.join(__dirname, UPLOAD_DIRECTORY),
			maxFileSize: MAX_FILLE_SIZE,
			keepExtensions: true,
		},
		parsedMethods: [POST, GET, PUT, PATCH, DELETE],
	});
};
