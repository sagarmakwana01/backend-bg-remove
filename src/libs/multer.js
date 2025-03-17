const multer = require('multer');
const path = require('path');

// Define storage for images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'logoImage') {
      cb(null, 'public/siteLogo'); // Store logo images in 'public/siteLogo'
    } else if (file.fieldname.startsWith('socialMedia')) {
      cb(null, 'public/socialMedia');
  }
    else if (file.fieldname === 'author_image') {
      cb(null, 'public/testimonial'); // Store testimonial images in 'public/testimonial'
    } else if (file.fieldname === 'imageUrl') {
      cb(null, 'public/why-choose-us'); // Store "why-choose-us" images
    } else if (file.fieldname.startsWith('tabImages')) {
      cb(null, 'public/why-choose-us'); // Store "why-choose-us" tab images
    } else if (file.fieldname.startsWith('imageUrl')) {
      cb(null, 'public/why-choose-us'); // Store social media images
    } else {
      cb(new Error('Invalid file type'), false); // Reject invalid fields
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter to allow only specific image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  if (extname) {
    return cb(null, true);
  }

  // If the file type is not allowed, throw an error
  cb(new Error('Only images are allowed!'), false);
};

// Multer setup
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    files: 10, // Restrict to 10 files max (adjust as necessary)
  }
});

// Functions to dynamically handle various fields

const getSocialMediaFields = (count = 10) => {
  return [
    { name: 'logoImage', maxCount: 1 },
    ...Array.from({ length: count }, (_, i) => ({ name: `socialMedia[${i}][image]`, maxCount: 1 }))
  ];
};

const getWhyChoose2 = (imageUrlCount = 5) => {
  return [
    ...Array.from({ length: imageUrlCount }, (_, i) => ({
      name: `imageUrl[${i}][imageUrl]`, 
      maxCount: 1,
    })),
  ];
};

// New function for WhyChooseUsFirst (dynamic handling for tabImages)
const getWhyChooseUsFirstFields = (tabImagesCount = 4) => {
  return [
    ...Array.from({ length: tabImagesCount }, (_, i) => ({
      name: `tabImages[${i}][tabImages]`,
      maxCount: 1
    })),
  ];
};

module.exports = { upload, getSocialMediaFields, getWhyChoose2, getWhyChooseUsFirstFields };
