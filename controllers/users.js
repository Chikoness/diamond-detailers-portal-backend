const config = require('../utils/config');
const users = require('../models/users_schema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const { nanoid } = require('nanoid');
const usersRouter = require('express').Router();
// const nodemailer = require('nodemailer'); // disable forgot password for now

// const resetPasswordExpiryHours = 3;

// const operation = {
//     create: 'create',
//     login: 'login',
//     resetPassword: 'resetPassword'
// }

// const htmlPage = (title, body) => 
//     `
//         <!DOCTYPE html>
//         <html lang='en'>
//         <head>
//             <meta charset='UTF-8'>
//             <meta name='viewport' content='width=device-width, initial-scale=1.0'>
//             <title>${title}</title>
//         </head>
//         <body>
//             ${body}
//         </body>
//         </html>
//     `

// const email = nodemailer.createTransport(
//     {
//         host: "mail.travee.io",
//         secure: false,
//         auth: {
//             user: "noreply@travee.io",
//             pass: "N0Rp@tAr#$856"
//         },
//         logger: true,
//         transactionLog: true // include SMTP traffic in the logs
//     },
//     {
//         from: 'Travee Travel <noreply@travee.io>'
//     }
// );

// const resetEmailMessage = (resetLink, recipientEmail) => {
//     return {        
//         to: `${recipientEmail}`, // comma separated list of recipients
//         subject: `Travee Travel: Reset Password Link for ${recipientEmail}`,
//         text: `Hello Traveer! Here is your requested link to reset the user password for ${recipientEmail}: ${resetLink}`,
//         html: `Dear Traveer, <br/> As requested, please click <a href=${resetLink}>here</a> to reset the user password for ${recipientEmail}.`
//     }
// }

const createUser = (req, res) => {
    const query = users.findOne({ email: req.body.email });
    query.exec(async (err, user) => {
        if (err) {
            console.log('Error: ' + err);
            return res.status(500).send({ message: 'Error: ' + err });
        }
        if (user) {
            return res.status(400).send({ message: 'User already exists!'});
        };

        const hash = await bcrypt.hash(req.body.password, 10);
        const u = new users({
            fName: req.body.fName,
            lName: req.body.lName,
            phoneNo: req.body.phoneNo,
            dob: req.body.dob,
            address: req.body.address,
            state: req.body.state,
            country: req.body.country,
            email: req.body.email,
            password: hash
        });
        const saved = await u.save();
        if (saved) {
            return res.status(200).send({ message: 'user successfully created!'});
        }
        return res.status(500).send({ message: 'Something went wrong...' });
    });
}

const loginUser = (req, res) => {
    const query = users.findOne({ email: req.body.email });
    query.exec(async (err, user) => {
        if (err) {
            console.log('Error: ' + err);
            return res.status(500).send({ message: 'Error: ' + err });
        }
        if (user) {
            const password = await bcrypt.compare(req.body.password, user.password);
            if (password) {
                const token = jwt.sign({ email: user.email }, config.SECRET);
                return res.status(200).send({ message: 'Successfully logged in!', token, email: user.email });
            }
            return res.status(401).send({ message: 'Password is invalid!' });
        }
        return res.status(400).send({ message: 'user does not exist!' });
    });
}

// const resetPassword = (req, res) => {
//     const query = users.findOne({ email: req.body.email });
//     query.exec(async (err, user) => {
//         if (err) {
//             console.log('Error: ' + err);
//             return res.status(500).send({ message: 'Error: ' + err });
//         }
//         if (user) {
//             if (user.passwordResetToken) {
//                 if ((Math.abs(Date.now() - user.passwordResetTokenDate) / 36e5) <= resetPasswordExpiryHours) {
//                     return res.status(400).send({ message: 'Too soon to request for another password reset link! Please check your email inbox or try again in ' + resetPasswordExpiryHours + ' hours!' });
//                 }
//             }

//             let passwordToken = nanoid();
//             while (await users.exists({ passwordResetToken: passwordToken })) {
//                 passwordToken = nanoid();
//             }

//             await user.updateOne({
//                 passwordResetToken: passwordToken,
//                 passwordResetTokenDate: Date.now()
//             });
//             const link = `https://${req.get("host")}/api/users/${passwordToken}`;

//             email.sendMail(resetEmailMessage(link, user.email), (err, info) => {
//                 if (err) {
//                     console.log('Error: ' + err);
//                     return res.status(500).send({ message: 'Error: ' + err });
//                 }
//                 console.log(info);
//                 console.log(`Reset password link successfully sent to ${user.email}`);
//             })
            
//             return res.status(200).send({ message: 'Reset password link successfully sent to ' + user.email + '!' });
//         }
//         return res.status(400).send({ message: 'user does not exist!' });
//     });
// }

// usersRouter
//     .post('/', (req, res) => {
//         switch (req.body.op) {
//             case operation.create:
//                 return createuser(req, res);
            
//             case operation.login:
//                 return loginuser(req, res);

//             // case operation.resetPassword:
//             //     return resetPassword(req, res);
//         }
//     })

usersRouter
    .post('/signup', (req, res) => {
        // switch (req.body.op) {
            // case operation.create:
                return createUser(req, res);
            
            // case operation.login:
            //     return loginuser(req, res);

            // case operation.resetPassword:
            //     return resetPassword(req, res);
        }
    )

usersRouter
    .post('/login', (req, res) => {
        // switch (req.body.op) {
            // case operation.create:
            //     return createuser(req, res);
            
            // case operation.login:
                return loginUser(req, res);

            // case operation.resetPassword:
            //     return resetPassword(req, res);
        }
    )
    // .post('/:passwordResetToken', (req, res) => {
    //     const query = users.findOne({ passwordResetToken: req.params.passwordResetToken });
    //     query.exec(async (err, user) => {
    //         if (err) {
    //             console.log('Error: ' + err);
    //             return res.status(500).send(htmlPage('Error!', err));
    //         }
    //         if (user) {
    //             if (req.body['new-password'] !== req.body['confirm-new-password'])
    //                 return res.status(200).send(htmlPage('Atauro Island Tycoon: Reset Password', '<h1>Password reset failed! Passwords do not match!'));
                
    //             const hash = await bcrypt.hash(req.body['new-password'], 10);
    //             await user.updateOne({
    //                 password: hash,
    //                 passwordResetToken: '',
    //                 passwordResetTokenDate: null
    //             })
    //             return res.status(200).send(htmlPage('Atauro Island Tycoon: Reset Password', '<h1>Password reset successful!'));
    //         }
    //         return res.status(400).send(htmlPage('Atauro Island Tycoon: Reset Password', '<h1>Password reset failed! User not found!'));
    //     });
    // })
    // .get('/:passwordResetToken', (req, res) => {
    //     const query = users.findOne({ passwordResetToken: req.params.passwordResetToken });
    //     query.exec(async (err, user) => {
    //         if (err) {
    //             console.log('Error: ' + err);
    //             return res.status(500).send(htmlPage('Error!', err));
    //         }
    //         if (user) {
    //             return res.status(200).send(htmlPage('Atauro Island Tycoon: Reset Password', `
    //                 <form method="POST">
    //                     <h1>Reset Password</h1>
    //                     <label for="new-password"><strong>New password:</strong></label>
    //                     <input type="password" name="new-password" required>
    //                     <label for="confirm-new-password"><strong>Confirm new password:</strong></label>
    //                     <input type="password" name="confirm-new-password" required>
    //                     <button type="submit">Reset</button>
    //                 </form>
    //             `));
    //         }
    //         return res.status(400).send(htmlPage('Atauro Island Tycoon: Invalid User', '<h1>User not found!</h1>'));
    //     });
    // });


module.exports = usersRouter;