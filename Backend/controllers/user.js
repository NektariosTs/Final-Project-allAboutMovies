const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer");
const UserModel = require("../models/user");
const EmailVerificationToken = require("../models/emailVerificationToken");
const PasswordResetToken = require("../models/passwordResetToken");
const { isValidObjectId } = require("mongoose");
const { generateRandomByte, sendError } = require("../utils/helper");

const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    const oldUser = await UserModel.findOne({ email });

    if (oldUser) return sendError(res, "This email is already in use!");

    const newUser = new UserModel({ name, email, password })
    await newUser.save()

    //create 6 digit otp
    //i create a for loop and i use the Math.round(math.random) because i wanted to the OTP(one time password) to be different all the time with 6 digits
    let OTP = "";
    for (let i = 0; i <= 5; i++) {
        const randomValue = Math.round(Math.random() * 9)
        OTP += randomValue;
    }
    //store otp inside our db
    const newEmailVerificationToken = new EmailVerificationToken({
        owner: newUser._id,
        token: OTP,
    });

    await newEmailVerificationToken.save();

    //send that otp to our user
    //the mailtrap details for sending the otp in mailtrap
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAIL_TRAP_USER,
            pass: process.env.MAIL_TRAP_PASS
        }
    });

    transport.sendMail({
        from: "verification@AllAboutMovies.com",
        to: newUser.email,
        subject: "Email Verification",
        html: `
        <p>Your verification OTP</p>
        <h1>${OTP}</h1>`
    })
    // i send the newUser elements as an response(i send only these things (name,email,password))
    res.status(201)
        .json({
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        });
};



//verify the email
const verifyEmail = async (req, res) => {
    const { userId, OTP } = req.body;
    //i check if the userId is valid or not with (isVAlidObjectId) because if you pass invalid userId and search the mongodb and mongoose it throw an error
    if (!isValidObjectId(userId)) return sendError(res, "Invalid user!");

    const user = await UserModel.findById(userId)
    if (!user) return sendError(res, "user not found!", 404);

    if (user.isVerified) return sendError(res, "user is already verified!");

    const token = await EmailVerificationToken.findOne({ owner: userId });
    if (!token) return sendError(res, "token not found!");

    const isMatched = await token.compareToken(OTP)
    if (!isMatched) return sendError(res, "Please submit a valid OTP!");

    user.isVerified = true;
    await user.save();

    await EmailVerificationToken.findByIdAndDelete(token._id)

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAIL_TRAP_USER,
            pass: process.env.MAIL_TRAP_PASS
        }
    });

    transport.sendMail({
        from: "verification@AllAboutMovies.com",
        to: user.email,
        subject: "Welcome Email",
        html: `<h1>Welcome to All About Movies</h1>`
    });

    //we sign in the jwt token and sending this token to our user, and if we get all these things inside the frontend when we verify the email it means that the user is main user and we don t need to ask for email and pass!
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            token: jwtToken,
            isVerified: user.isVerified,
            role: user.role,
        },
        message: "Your email is verified",
    });
};
// when the user is looged in but he cant use some fetures which only verified
const resendEmailVerificationToken = async (req, res) => {
    const { userId } = req.body;
    const user = await UserModel.findById(userId);
    if (!user) return sendError(res, "user not found!");

    if (user.isVerified)
        return sendError(res, "This email id is already verified!");

    const alreadyHasToken = await EmailVerificationToken.findOne({
        owner: userId,
    });
    if (alreadyHasToken)
        return sendError(
            res,
            "Only after one hour you can request for another token!"
        );

    let OTP = ""; 
    for (let i = 0; i <= 5; i++) {
        const randomValue = Math.round(Math.random() * 9)
        OTP += randomValue;
    }
    //store otp inside our db
    const newEmailVerificationToken = new EmailVerificationToken({
        owner: user._id,
        token: OTP,
    });

    await newEmailVerificationToken.save();

    //send that otp to our user
    //the mailtrap details for sending the otp in mailtrap
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAIL_TRAP_USER,
            pass: process.env.MAIL_TRAP_PASS
        }
    });

    transport.sendMail({
        from: "verification@AllAboutMovies.com",
        to: user.email,
        subject: "Email Verification",
        html: `
        <p>Your verification OTP</p>
        <h1>${OTP}</h1>`
    });
    res.json({
        message: "New OTP has been sent to your registered email account.",
    });

};

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.json({ message: "email is missing" });

    const user = await UserModel.findOne({ email })
    if (!user)
        return res.status(404).json({ message: "User not found" });

    const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id })
    if (alreadyHasToken)
        return res.json({ error: "Only after one hour you can request another token!" });

    const token = await generateRandomByte();
    const newPasswordResetToken = await PasswordResetToken({ owner: user._id, token });
    await newPasswordResetToken.save();
    //after saving the token we must send the link inside the email address
    const resetPasswordUrl = `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAIL_TRAP_USER,
            pass: process.env.MAIL_TRAP_PASS
        }
    });

    transport.sendMail({
        from: "security@AllAboutMovies.com",
        to: user.email,
        subject: "Reset password link",
        html: `
        <p>Click here to reset password</p>
        <a href="${resetPasswordUrl}">Change Password</a>`
    });

    res.json({ message: "Link sent to your email!" });
};

//it send us the status if its valid
const sendResetPasswordTokenStatus = (req, res) => {
    res.json({ valid: true })
}
//the functionality for new password
const resetPassword = async (req, res) => {
    const { newPassword, userId } = req.body;

    const user = await UserModel.findById(userId);
    const matched = await user.comparePassword(newPassword);
    if (matched)
        return sendError(
            res,
            "The new password must be different from the old one!"
        );

    user.password = newPassword;
    await user.save();

    await PasswordResetToken.findByIdAndDelete(req.resetToken._id);

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.MAIL_TRAP_USER,
            pass: process.env.MAIL_TRAP_PASS
        },
    });

    transport.sendMail({
        from: "security@AllAboutMovies.com",
        to: user.email,
        subject: "password reset successfully",
        html: `
        <h1>password reset successfully</h1>
        <p>Now you can use new password!!</p>`,
    });

    res.json({ message: "Password reset successfully,now you can use new password!!" });

};


const signIn = async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return sendError(res, "Wrong Email or Password!");

    const matched = await user.comparePassword(password);
    if (!matched) return sendError(res, "Wrong Email or Password!");

    const { _id, name, isVerified, role } = user;

    const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET);

    res.json({ user: { id: _id, name, email, token: jwtToken, isVerified, role } })

}


module.exports = {
    verifyEmail,
    createUser,
    resendEmailVerificationToken,
    forgetPassword,
    sendResetPasswordTokenStatus,
    resetPassword,
    signIn
};
