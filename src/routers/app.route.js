// const frameController = require('../controllers/form.controller');
const express = require('express');
const {upload,getSocialMediaFields,getWhyChooseUsFirstFields}= require('../libs/multer');
const { getFlash } = require('../utils/flash');
const userController = require('../../src/controllers/userController');
const auth = require('../../middleware/auth.js');
const protected = require('../../middleware/protected.js');
const headerController = require('../../src/controllers/homePageController');
const router = express.Router();


//User routes start
// router.get('/nameadd', (req, res) => {
//     const id = req?.query?.code
//     if (!id) {
//       return res.redirect('/login')
//     }
//     const decode = jwt.verify(id, process.env.CRYPTO_SEC_KET);
//     if (!decode) {
//       return res.redirect('/login')
//     }
//     res.render('nameedit.ejs', { user: decode })
//   })
  // router.get('/user_table',protected,userController.getUserTable);

  router.get('/login',auth, userController.getLogin);
  router.get('/signup',auth, userController.getSignup);
  router.get('/verify-email/:token', userController.getEmailverify);
  router.get('/change-password',userController.getChangePass);
  router.post('/logout', protected, userController.postLogout);
  router.post('/signup',auth, userController.postSignup);
  router.post('/login',auth, userController.postLogin);
  router.post("/change",userController.postChangePass)
// //  User routes end





// // Frame routes start
  router.get('/', protected,(req, res) => {
      const errorMesssge = getFlash(req, res);
      res.render('pages/home', { title: 'Home', page: 'home', requiredJs:true, message: errorMesssge, currentPath: req.path});
  });

router.get('/add-header',protected,(req, res) => {
  const errorMesssge = getFlash(req, res);
  res.render('pages/createheader', { title: 'createheader', page: 'createheader',requiredJs:true, message: errorMesssge,currentPath: req.path });
});
router.get('/add-footer',protected,(req, res) => {
  const errorMesssge = getFlash(req, res);
  res.render('pages/createFooter', { title: 'Create Footer ', page: 'add-footer',requiredJs:true, message: errorMesssge,currentPath: req.path });
});
router.get('/testimonials',protected,(req, res) => {
  const errorMesssge = getFlash(req, res);
  res.render('pages/createTestimonial', { title: 'create Testimonial', page: 'create Testimonial',requiredJs:true, message: errorMesssge,currentPath: req.path });
});
router.get('/get-why-choose-first',protected,(req, res) => {
  const errorMesssge = getFlash(req, res);
  res.render('pages/whyChooseUsFirst', { title: 'create whyChooseUsFirst', page: 'create whyChooseUsFirst',requiredJs:true, message: errorMesssge,currentPath: req.path });
});

router.post('/header',  upload.single('logoImage'), headerController.createHeader);
router.get('/header', headerController.getHeaders);
router.post('/header/update/:id', upload.single('logoImage'), headerController.updateHeader);
router.get('/edit-header',headerController.getEditData);

router.post('/footer', upload.fields(getSocialMediaFields(10)), headerController.createFooter);
router.get('/footers', headerController.getAllFooters);

router.get('/edit-footer',headerController.getEditFooter);

router.get('/why-choose-us-2', headerController.getWhyChooseUsSecond);
router.get('/edit-why-chosoe-2',headerController.getEditWhyChoose2);
router.get('/get-testimonial-table',headerController.testimonialTable);
router.get('/get-why-choose-2-table',headerController.whyChooseUs2Table);
// Update footer
router.post('/footer/update/:footerId', upload.fields(getSocialMediaFields(10)), headerController.updateFooter);

router.post('/why-choose-2/update/:whychooseId', upload.single('imageUrl'), headerController.updateWhyChoose2);
// testimonial
// router.get('/testimonials', headerController.getTestimonials);
router.post('/testimonial',  upload.single('author_image'), headerController.createTestimonial);
router.delete('/testimonial-delete/:id', headerController.deleteTestimonial);
router.post('/testimonials/update/:id', upload.single('author_image'), headerController.updateTestimonial);
router.get('/get-testimonial', headerController.testimonialGetApi);
// subscribe
router.get('/subscribe-table', headerController.getSubscribe);
router.post('/create-subscription', headerController.createSubscription);
router.delete('/delete-subscription/:id', headerController.deleteSubscription);

// whyChooseUsFirst
router.post('/why-choose-us-first',upload.fields(getWhyChooseUsFirstFields(4)),
headerController.createWhyChooseUsFirst
);
router.post('/why-choose-first/update/:id',upload.fields(getWhyChooseUsFirstFields(4)),
headerController.updateWhyChooseUsFirst
);
router.get('/why-choose-us-first-table',headerController.whyChooseUsFirstTable);
router.delete('/delete-why-choose-first/:id', headerController.deleteWhyChooseFirst);
// api
router.get('/get-why-choose-first-api', headerController.whyChooseUsFirstGetApi);

module.exports = router;

