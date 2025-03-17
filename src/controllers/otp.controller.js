// const { generateOTP, verifyOTP } = require("../libs/otp");

// exports.otplogin = async (req, res) => {    
//     try {
//        generateOTP(req.body, (err, hash) => {
//            if (err) {
//                console.error('Error generating OTP:', err);
//                req.app.get('logger').error('Error generating OTP:', err);
//                return res.status(500).json({ success: false, message: 'Internal server error' });
//            }
//            res.status(200).json({ success: true, hash });
//        });
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         req.app.get('logger').error('Error fetching user:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// }
// exports.otpVerify = async (req, res) => {
   
//     try {
//         verifyOTP(req.body, (err, message) => {
//             if (err) {
//                 console.error('Error verifying OTP:', err);
//                 req.app.get('logger').error('Error verifying OTP:', err);
//                 return res.status(400).json({ success: false, message });
//             }
//             res.status(200).json({ success: true, message });
//         });
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         req.app.get('logger').error('Error fetching user:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// }