const { getFlash } = require("../../src/utils/flash");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const crypto = require("crypto")
const nodemailer = require('nodemailer');
const prisma = require("../../prisma/index");
const { changePassNew, findUserbyUniqueId } = require('../../prisma/dbquery');

// admin panel controller start
let transporter = nodemailer.createTransport({
    service: 'gmail',
    type: "SMTP",
    auth: {
        user: process.env.EMAIL_SEND,
        pass: process.env.EMAIL_SEND_PASS
    },
    tls: {
    
        rejectUnauthorized: false
    },
    logger: true,   
    debug: true
})

const sendMails = (mailOptions) => {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {  
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);    
        }
    });
}

exports.getSignup = (req, res) => {
    res.render('pages/signup',{ title: 'signUp', page: 'signup',requiredJs:false, currentPath: req.path})
}

exports.postSignup = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.userid,
            },
        })
        if (!user) {
            let token = jwt.sign(req.body, process.env.JWT, { expiresIn: '15m' });
            if (!!token) {
                let statusMessage = `
                        Hi,<br/>
                        Thanks for registering, please verify your email by <a href="${req.get('origin')}/verify-email/${token}">clicking here</a>.<br/>
                        Sincerely,<br/>
                        <h4 style="color:red;">This link will expire in 15 minutes.<br>Please note that this link is for your use only and should not be shared with anyone else.</h4>`
                let mailOptions = {
                    from: process.env.EMAIL_SEND,
                    to: req.body.userid,
                    subject: `Verification Mail`,
                    html: statusMessage,
                };
                sendMails(mailOptions)
                res.send({ status: 'valid signup' })
            } else {
                res.send({ status: 'something wrong' })
            }
        } else {
            res.send({ status: 'email found' })
        }
    } catch (error) {
        console.log(error)
        res.send({ status: 'something wrong' })
    }
}

exports.getEmailverify = (req, res) => {
    const token = req.params.token
    jwt.verify(token, process.env.JWT, async function (err, decoded) {
        if (err) {
            res.render('verified_mail', { status: 'not verified', requiredJs:false, currentPath: req.path });
        } else {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                    
                        email: decoded.userid,
                    },
                })
                if (!user) {
                    const hashPassword = CryptoJS.AES.encrypt(decoded.password, process.env.CRYPTO_SEC_KET).toString();
                    const currentDate = new Date();
                    prisma.user.create({
                        data: {
                            email: decoded.userid,
                            name: decoded.name,
                            password: hashPassword,
                            user_verify: 'Yes',
                            createdAt: currentDate,
                        },
                    }).then(async () => {
                        res.render('pages/verified_mail', { status: 'verified', requiredJs:false, title: 'verified_mail', page: 'verified_mail', currentPath: req.path });
                    }).catch(() => {
                        res.render('pages/verified_mail', { status: 'not verified', requiredJs:false,  title: 'verified_mail', page: 'verified_mail', currentPath: req.path });
                    })
                } else {
                    res.render('pages/verified_mail', { status: 'already verified', requiredJs:false,  title: 'verified_mail', page: 'verified_mail', currentPath: req.path });
                }
            } catch (error) {
                console.log(error)
            }
        }
    });
}

exports.postNamedAdd = async (req, res) => {
    try {
        const useQuery = req?.body?.code
        const userName = req?.body?.username

        if (!useQuery) {
            return res.status(500).json({ error: 'Somthings went wrong', data: false, message: false })
        }
        if (!userName) {
            return res.status(400).json({ error: 'The username is required', data: false, message: false })
        }
        const decode = jwt.verify(useQuery, process.env.CRYPTO_SEC_KET);
        if (!decode?.id) {
            return res.redirect('/login')
        }

        await prisma.user.update({
            where: {
                id: parseInt(decode?.id)
            },
            data: {
                name: userName,
                track: 'Yes'
            }
        })
        let mailOptions = {
            from: process.env.EMAIL_SEND,
            to: decode?.email,
            subject: `Welcome`,
            html: '<h1>Welcome</h1>',
        };
        sendMails(mailOptions)
        req.logIn(decode, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Somthings went wrong', data: false, message: false })
            }
            res.status(200).json({ message: true, error: false, data: false }); // Redirect to a secure page upon successful login
        });
    } catch (error) {
        console.log(error)
        req.app.get('logger')?.error('Error  somthings went wrong', error);
        return res.status(500).json({ error: 'Somthings went wrong', data: false, message: false })
    }
}

exports.getLogin = (req, res) => {
    const errorMessage = getFlash(req, res);
    res.render('pages/login',{ title: 'Login', page: 'login',requiredJs:false, message: errorMessage, currentPath: req.path });
}

exports.postLogin = (req, res, next) => {
    const { userid, password } = req.body;

    if (!userid || !password) {
        res.send('error', 'All Field Is Required');
        return res.redirect('/login');
    }
    passport.authenticate('admin-local', (err, user, info) => {
        // console.log(info, user)
        if (err) {
            res.send({ status: info.message });
            return next(err);
        }
        if (!user) {
            res.send({ status: info.message });
            return next(err);
        }
        req.logIn(user, (err) => {
            if (err) {
                res.send({ status: info.message });
                return next(err);
            }
            req.session.userId = user.id;
            return res.send({ status: 'valid login', url: '/' });

        })

    })(req, res, next)
}

exports.postLogout = (req, res, next) => {
    console.log('Logging out user:', req.session.user);
    
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                req.app.get('logger')?.error('Error destroying session', err);
                return res.status(500).send("Logout failed.");
            }
            res.redirect('/login');
        });
    });
};


// /change-password
exports.getChangePass = async (req, res) => {
    res.render("pages/changePass", { title: 'Change Password', page: 'Change Password', requiredJs:false, currentPath: req.path})
}

const decryptPassword = (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, process.env.CRYPTO_SEC_KET);
    return bytes.toString(CryptoJS.enc.Utf8);
};


exports.postChangePass = async (req, res) => {
    const { old_password, new_password } = req.body;

    try {
        const id = req.user.id;

        // Check if old_password and new_password are provided
        if (!old_password?.trim() || !new_password?.trim()) {
            req.app.get('logger')?.error('Old Password and New Password are required.');
            return res.status(400).json({ message: "Old Password and New Password are required." });
        }

        console.log(id);
        const user = await findUserbyUniqueId(id);
        const originalPassword = decryptPassword(user?.password);

        // Check if the old password matches the original password
        if (originalPassword?.trim() !== old_password?.trim()) {
            return res.status(400).json({ message: "Old password does not match." });
        }

        const encyPass = CryptoJS.AES.encrypt(new_password.trim(), process.env.CRYPTO_SEC_KET).toString();
        const updateResult = await changePassNew(id, { password: encyPass });

        // Check if the password was updated successfully
        if (updateResult) {
            return res.status(200).json({ message: "Password changed successfully." });
        } else {
            return res.status(500).json({ message: "Something went wrong." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error?.message || "Something went wrong." });
    }
};

exports.getUserTable = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                paid: true,
                role: true,
            }
        });

        res.render( "pages/userTable",{ users, title: 'User Table', page: 'User Table', requiredJs:false, currentPath: req.path });
    } catch (error) {
        console.error('Error fetching users:', error);
        req.app.get('logger')?.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
// admin panel controller end
