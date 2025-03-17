const LocalStratagy = require('passport-local').Strategy
const prisma = require('../prisma/index')
const CryptoJS = require("crypto-js");

function init(passport) {
  passport.use('user-local', new LocalStratagy({ usernameField: 'userid' }, async (userid, password, done) => {
      const user = await prisma.user.findUnique({
          where: {
              email: userid,
          },
      });
     
      if (!user) {
          return done(null, false, { message: "No User" });
          
      }

      if (user.user_verify === 'No') {
          return done(null, false, { message: 'Not Verified Email' });
      }
      
      const isCorrectPassword = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SEC_KET).toString(CryptoJS.enc.Utf8) === password?.trim();

      if (isCorrectPassword) {
          return done(null, user, { message: "Logged in Successfully" });
      } else {
          return done(null, false, { message: "Wrong Email or Password" });
      }
  }));


  passport.use('admin-local',new LocalStratagy({ usernameField: 'userid' }, async (userid, password, done) => {
    const user = await prisma.user.findUnique({
      where: {
        email: userid,
      },
    })
    // const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return done(null, false, { message: "No Admin Found" })
    }

    if(user.role == 'User'){
      return done(null, false, { message: "No Admin Found" })
    }
// console.log(user,password)
    const isCorrectpassword = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SEC_KET).toString(CryptoJS.enc.Utf8) === password;
    if(isCorrectpassword){
      return done(null, user, { message: "Logged in Succesfully" })
    }else{
      return done(null, false, { message: "Wrong Email or Password" })
    }

  }))

 
  passport.serializeUser((user, done) => {
    done(null, user.id);
  })

  passport.deserializeUser((id, done) => {
  prisma.user.findUnique({
      where: {
          id: id,
      },
  }).then((result) => {
      done(null, result);
    }).catch((err) => {
      done(err, null);
    })
  })
}
module.exports = init;