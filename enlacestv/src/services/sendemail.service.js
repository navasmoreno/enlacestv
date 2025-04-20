import { Resend } from 'resend';

const resend = new Resend(process.env.VUE_APP_RESEND_APIKEY);

export class SendEmail {
    // constructor(){
    //     this.resend = new Resend(process.env.VUE_APP_RESEND_APIKEY);
    // }
    async Send(subject = "", content = "") {
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'navas.moreno.devs@gmail.com',
            subject: 'Hello World',
            html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
        });
        // var response = {
        //     done: false,
        //     error: null,
        // }
        // if (!subject || subject.length == 0) {
        //     response.error = true;
        // } else {
        //     const options = {
        //         method: 'POST',
        //         mode: 'no-cors',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${process.env.VUE_APP_RESEND_APIKEY}`,
        //         },
        //         body: JSON.stringify({
        //             from: process.env.VUE_APP_RESEND_EMAIL_FROM,
        //             to: [process.env.VUE_APP_RESEND_EMAIL_TO],
        //             subject: subject,
        //             html: content
        //         })
        //     }
        //     console.log(options);

        //     const res = await fetch('https://api.resend.com/emails', options);
        //     console.log(res)
        //     return res.ok;
        // }
        // return response;
    }
}
