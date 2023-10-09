import nodemailer from 'nodemailer';
import {
	NAME_MAILBOX,
	MAIL_AUTHORIZATION_CODE,
	EMAIL_ADDRESS,
	EMAIL_PORT,
	RECIPIENT_MAILBOX,
	SENDER_MAILBOX,
} from '../config/config';
import { MailboxValueType } from '../global';
import { getRedis, setRedis } from './redis';

const transporter = nodemailer.createTransport({
	host: EMAIL_ADDRESS,
	port: EMAIL_PORT,
	secure: true,
	auth: {
		user: SENDER_MAILBOX,
		pass: MAIL_AUTHORIZATION_CODE,
	},
});

/**
 * @private
 * 基础邮件服务，未限制发送次数不可直接调用！！！
 */
const BasicMailService = ({
	mailboxTitle,
	sender,
	recipient,
	subject,
	html,
	text,
}: any) => {
	try {
		transporter.sendMail({
			from: { name: mailboxTitle, address: sender },
			to: recipient,
			subject,
			html,
			text,
		});
		return { state: true };
	} catch (error) {
		return { state: false, error };
	}
};

/**
 * @private
 * 系统发生错误时，调用此接口通知 运维 / 开发者 eg：数据库连接错误等
 */
const ErrorEmail = (options: MailboxValueType) => {
	try {
		const { mailboxTitle, subject, html, text } = options;
		return BasicMailService({
			mailboxTitle,
			sender: SENDER_MAILBOX,
			recipient: RECIPIENT_MAILBOX,
			subject,
			html,
			text,
		});
	} catch (error) {
		console.error(error);
	}
};

/**
 * @private
 * 系统发生错误时，调用此接口通知 运维 / 开发者 eg：数据库连接错误等
 */
const WarningEmail = (options: MailboxValueType) => {
	try {
		const { mailboxTitle, subject, html, text } = options;
		return BasicMailService({
			mailboxTitle,
			sender: SENDER_MAILBOX,
			recipient: RECIPIENT_MAILBOX,
			subject,
			html,
			text,
		});
	} catch (error) {
		console.error(error);
	}
};

/**
 * @private
 * 通知邮件
 */
const InfoEmail = async (key: string, options: MailboxValueType) => {
	const { subject, recipient, html, text } = options;

	setRedis(`${key}-code`, text, 5 * 60);
	const lastSentTime = await getRedis(`last-${key}-time`);
	if (lastSentTime) {
		const currentTime = Date.now();
		const timeDiff = currentTime - parseInt(lastSentTime);
		const remainingTime = 60 * 1000 - timeDiff;
		if (remainingTime > 0) {
			return {
				state: false,
				error: `请勿频繁请求验证码！`,
			};
		}
	}
	try {
		const res = BasicMailService({
			mailboxTitle: NAME_MAILBOX,
			sender: SENDER_MAILBOX,
			recipient,
			subject,
			html,
			text,
		});
		setRedis(`last-${key}-time`, Date.now().toString(), 60);
		return res;
	} catch (error) {
		return { state: false, error };
	}
};

export { ErrorEmail, InfoEmail, WarningEmail };
