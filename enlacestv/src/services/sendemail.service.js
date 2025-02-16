import { Resend } from 'resend';

const resend = new Resend(process.env.VUE_APP_RESEND_APIKEY);

export default {
    name: 'SendEmailService',
    async Send(to = "", subject = "", content = "") {
        var response = {
            done: false,
            error: null,
        }
        if (!to || to.length == 0 || !subject || subject.length == 0) {
            response.error = true;
        } else {
            const { data, error } = await resend.emails.send({
                from: 'Enlaces <no-reply@enlaces.vercep.app>',
                to: [to],
                subject: subject,
                html: content,
            });
            if (error) response.error = error;
            else response.done = true;
        }
        return response;
    }
}
