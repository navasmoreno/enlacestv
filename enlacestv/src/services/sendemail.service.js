// import { Resend } from 'resend';

export class SendEmail {
    // constructor(){
    //     this.resend = new Resend(process.env.VUE_APP_RESEND_APIKEY);
    // }
    async Send(subject = "", content = "") {
        var response = {
            done: false,
            error: null,
        }
        if (!subject || subject.length == 0) {
            response.error = true;
        } else {
            // const { data, error } = await this.resend.emails.send({
            //     from: 'Enlaces <Acme <onboarding@resend.dev>',
            //     to: [process.env.VUE_APP_RESEND_EMAIL],
            //     subject: subject,
            //     html: content,
            // });
            // console.log(error);
            // if (error) response.error = error;
            // else response.done = true;
            const options = {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.VUE_APP_RESEND_APIKEY}`,
                },
                body: JSON.stringify({
                    from: process.env.VUE_APP_RESEND_EMAIL_FROM,
                    to: [process.env.VUE_APP_RESEND_EMAIL_TO],
                    subject: subject,
                    html: content
                })
            }
            console.log(options);

            const res = await fetch('https://api.resend.com/emails', options);
            console.log(res)
            return res.ok;
        }
        return response;


    }
}
