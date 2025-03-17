const express = require('express');
const router = express.Router();
// const formController = require('../controllers/form.controller');
// const otpController = require('../controllers/otp.controller');
// const {verifyToken} = require('../../middleware/jwtMiddleware.js');
// const userController = require('../controllers/userController.js');


// //get started with the api route
// router.get('/frame', formController.getFrames);
// //get ended with the api route
// //OTP routes
// router.post('/otplogin', otpController.otplogin);
// router.post('/otpverify', otpController.otpVerify);

// // user routes started
// router.post("/mobileRegister",userController.userRegisterForMobile)
// router.post("/createBabyForMobile",userController.createBaby)
// router.post("/mobileLogin",userController.userForMobile)
// router.post("/userMobileExist",userController.userPhoneExist)
// router.put("/update-profile/:userId", userController.updateUserProfile);
// router.put("/update-baby-profile/:babyId", userController.updateBabyProfile);
// router.put('/babies/:babyId/select', userController.selectBaby);
// router.delete('/baby-delete/:id', userController.deleteBaby);
// router.get("/profile", verifyToken, (req, res) => {
//    res.json({ message: "Profile data", user: req.user });
   
// });
// router.get('/getUserBabys/:userId', userController.getUserBabies);

// router.get('/sticker', formController.getStickerApi);
// router.get('/background', formController.getBackgroundApi);
// router.get('/template', formController.getTemplateApi);
// // user routes ended
module.exports = router;