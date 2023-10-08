import Router from 'koa-router';
import { sendVerificationCode } from '../middlewares/utils';
const router = new Router({ prefix: '/' });

router.post('sendcode', sendVerificationCode);

export default router;
