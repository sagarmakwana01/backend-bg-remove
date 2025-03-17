const prisma = require("../../prisma/index");
const { setFlash } = require('../utils/flash');
const fs = require('fs');
const path = require('path');


exports.createHeader = async (req, res) => {
  try {
    const { logoText } = req.body;
    // Handle checkbox
    // Uploaded logo image filename (if file exists)
    const logoImage = req.file ? req.file.filename : null;
    // Check if menuItems exist and parse them
    const menuItems = req.body.menuItems || [];

    const newHeader = await prisma.header.create({
      data: {
        logoText,
        logoImage,
        menuItems: {
          create: Array.isArray(menuItems)
            ? menuItems.map(item => ({
              label: item.label,
              url: item.url,
            }))
            : [] // If only one menu item is submitted, you may need to handle that separately
        }
      }
    });

    res.redirect('/add-header');
  } catch (error) {
    console.error('Error creating header:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getHeaders = async (req, res) => {
  try {
    // Fetch headers from the database
    const headers = await prisma.header.findMany({
      include: {
        menuItems: true, // Include related menuItems
      },
    });

    if (!headers) {
      return res.status(404).json({ success: false, message: 'No headers found' });
    }

    res.status(200).json({ success: true, data: headers });
  } catch (error) {
    console.error('Error fetching headers:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.updateHeader = async (req, res) => {
  try {
    const { id } = req.params; // Header ID from URL params
    const { logoText } = req.body;

    // Handle checkbox (assuming 'on' is coming from form)

    // Uploaded logo image filename (if file exists)
    const logoImage = req.file ? req.file.filename : null;

    // Menu items array
    const menuItems = req.body.menuItems || [];

    // Validate if header exists
    const existingHeader = await prisma.header.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingHeader) {
      return res.status(404).json({ success: false, message: 'Header not found' });
    }

    // Update the header fields (logoText, logoImage, active)
    const updatedHeader = await prisma.header.update({
      where: { id: parseInt(id) },
      data: {
        logoText,
        ...(logoImage && { logoImage }) // Update logo only if a new one is uploaded
      }
    });

    // Delete all old menu items related to the header (optional, depends on your use case)
    await prisma.menuItem.deleteMany({
      where: { headerId: parseInt(id) }
    });

    // Add new menu items if provided
    if (menuItems.length > 0) {
      await prisma.menuItem.createMany({
        data: Array.isArray(menuItems)
          ? menuItems.map(item => ({
            label: item.label,
            url: item.url,
            headerId: parseInt(id)
          }))
          : []
      });
    }

    res.redirect('/add-header'); // Or to your listing page `/header/list`
  } catch (error) {
    console.error('Error updating header:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getEditData = async (req, res) => {
  try {
    const header = await prisma.header.findMany({
      include: {
        menuItems: true, // Include related menuItems
      },
    });
    // Render the EJS page with the fetched frame and header data
    res.render('pages/updateHeader', {
      header, // Pass header data to the EJS template
      title: "Edit Header",
      page: "Edit Header",
      requiredJs: false,
      currentPath: req.path
    });
  } catch (error) {
    console.error('Error fetching frames:', error);
    req.app.get('logger')?.error('Error fetching frames:', error);
    res.status(500).send('Internal Server Error');
  }
};

// ✅ Create Footer


exports.createFooter = async (req, res) => {
  try {
    const { logoText, copyright } = req.body;

    // Handle logo image upload
    const logoImage = req.files['logoImage'] ? req.files['logoImage'][0].filename : null;

    // Social media (links + image names)
    const socialMedia = [];
    const socialLinks = req.body.socialMedia || [];

    if (Array.isArray(socialLinks)) {
      socialLinks.forEach((item, index) => {
        socialMedia.push({
          link: item.link,
          image: req.files[`socialMedia[${index}][image]`]
            ? req.files[`socialMedia[${index}][image]`][0].filename
            : null,
        });
      });
    }

    // Company Links
    const companyLinks = req.body.companyLinks || [];

    // Tools & API
    const toolsAPI = req.body.toolsAPI || [];

    // How To Use
    const howToUse = req.body.howToUse || [];

    // Support Links
    const support = req.body.support || [];

    const newFooter = await prisma.footer.create({
      data: {
        logoText,
        copyright,
        logoImage,
        socialMedia,
        companyLinks,
        toolsAPI,
        howToUse,
        support,
      },
    });

    res.redirect('add-footer');
  } catch (error) {
    console.error('Error creating footer:', error);
    res.render('pages/footerAdd', { message: { type: 'danger', message: 'Something went wrong!' } });
  }
};


// ✅ Get All Footers
exports.getAllFooters = async (req, res) => {
  try {
    const footers = await prisma.footer.findMany();
    res.status(200).json({ success: true, data: footers });
  } catch (error) {
    console.error('Error fetching footers:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.updateFooter = async (req, res) => {
  try {
    const { footerId } = req.params; // Get ID from URL params
    const { logoText, copyright } = req.body;

    // Find existing footer
    const footer = await prisma.footer.findUnique({
      where: { id: parseInt(footerId) },
    });

    if (!footer) {
      return res.status(404).json({ success: false, message: 'Footer not found' });
    }

    // Handle logo image (check if req.files is present)
    let logoImage = footer.logoImage;
    if (req.files && req.files['logoImage']) {
      logoImage = req.files['logoImage'][0].filename;
    }

    // Social media (links + images)
    const socialMedia = [];
    const socialLinks = req.body.socialMedia || [];

    if (Array.isArray(socialLinks)) {
      socialLinks.forEach((item, index) => {
        socialMedia.push({
          link: item.link,
          image: req.files && req.files[`socialMedia[${index}][image]`]
            ? req.files[`socialMedia[${index}][image]`][0].filename
            : (footer.socialMedia[index]?.image || null),
        });
      });
    }

    // Company Links, Tools API, How To Use, Support Links
    const companyLinks = req.body.companyLinks || footer.companyLinks || [];
    const toolsAPI = req.body.toolsAPI || footer.toolsAPI || [];
    const howToUse = req.body.howToUse || footer.howToUse || [];
    const support = req.body.support || footer.support || [];

    // Update footer in DB
    const updatedFooter = await prisma.footer.update({
      where: { id: parseInt(footerId) },
      data: {
        logoText,
        copyright,
        logoImage,
        socialMedia,
        companyLinks,
        toolsAPI,
        howToUse,
        support,
      },
    });

    res.redirect('/edit-footer'); // or wherever you want to redirect
  } catch (error) {
    console.error('Error updating footer:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


exports.getEditFooter = async (req, res) => {
  try {
    const footer = await prisma.footer.findMany();
    // Render the EJS page with the fetched frame and header data
    res.render('pages/updateFooter', {
      footer, // Pass header data to the EJS template
      title: "Edit Footer",
      page: "Edit Footer",
      requiredJs: false,
      currentPath: req.path
    });
  } catch (error) {
    console.error('Error fetching Update Footer:', error);
    req.app.get('logger')?.error('Error fetching Update Footer:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getWhyChooseUsSecond = async (req, res) => {
  try {
    // Fetch headers from the database
    const whyChooseSecond = await prisma.whyChooseUsSecond.findMany();

    if (!whyChooseSecond || whyChooseSecond.length === 0) {
      return res.status(404).json({ success: false, message: 'No whyChooseUssectionsecond found' });
    }

    res.status(200).json({ success: true, data: whyChooseSecond });
  } catch (error) {
    console.error('Error fetching whyChooseUssectionsecond:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getEditWhyChoose2 = async (req, res) => {
  try {
    const whyChoose2 = await prisma.whyChooseUsSecond.findMany();

    res.render('pages/whyChooseSecond', {
      whyChoose2,
      title: "Edit why choose us 2",
      page: "Edit why choose us 2",
      requiredJs: false,
      currentPath: req.path
    });

  } catch (error) {
    console.error('Error fetching Update why choose 2:', error);
    req.app.get('logger')?.error('Error fetching Update why choose 2:', error);
    res.status(500).send('Internal Server Error');
  }
};


exports.updateWhyChoose2 = async (req, res) => {
  const whychooseId = parseInt(req.params.whychooseId); // ID from URL

  const { linkName, link, iconUrl } = req.body;

  try {
    // Check required fields
    if (!linkName || !link || !iconUrl) {
      return res.status(400).json({
        success: false,
        message: 'All fields (linkName, link, iconUrl) are required',
      });
    }

    // Find existing record
    const existing = await prisma.whyChooseUsSecond.findUnique({
      where: { id: whychooseId },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    // Check for new image upload
    let imageUrl = existing.imageUrl; // Default to existing image
     // If new image uploaded, delete the old one
     if (req.file) {
      imageUrl = req.file.filename;

      // Construct old image path
      const oldImagePath = path.join(__dirname, '../../public/why-choose-us', existing.imageUrl);

      // Check if old image exists and delete it
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log('Old image deleted:', oldImagePath);
      } else {
        console.log('Old image not found:', oldImagePath);
      }
    }

    
    // Update record in DB
    const updatedWhyChooseUs2 = await prisma.whyChooseUsSecond.update({
      where: { id: whychooseId },
      data: {
        linkName,
        link,
        iconUrl,
        imageUrl,
      },
    });

    res.redirect('/get-why-choose-2-table');
    // OR use JSON response:
    // res.json({ success: true, data: updatedWhyChooseUs2 });

  } catch (error) {
    console.error('Error updating WhyChooseUs2:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.whyChooseUs2Table = async (req, res) => {
  try {
    const whyChooseUsTable2 = await prisma.whyChooseUsSecond.findMany();
    // Render the EJS page with the fetched frame and header data
    res.render('pages/whyChooseUsTable2', {
      whyChooseUsTable2, // Pass header data to the EJS template
      title: "whyChooseUsTable2 Table",
      page: "whyChooseUsTable2 Table",
      requiredJs: false,
      currentPath: req.path
    });
  } catch (error) {
    console.error('Error fetching Update whyChooseUsTable2 Table:', error);
    req.app.get('logger')?.error('Error fetching whyChooseUsTable2 Table:', error);
    res.status(500).send('Internal Server Error');
  }
};



exports.createTestimonial = async (req, res) => {
  try {
    const { author_name, author_designation, description, link, } = req.body;
   
    // Uploaded logo image filename (if file exists)
    const author_image = req.file ? req.file.filename : null;

    // Input validation: Check if required fields are provided
    if (!author_name || !author_designation || !description || !link || !author_image) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: author_name, author_designation, description, link, author_image.',
      });
    }

    const newTestimonial  = await prisma.testimonial.create({
      data: {
        author_name,
        author_designation,
        description,
        link,
        author_image,
        }
 });

      // Respond with the newly created testimonial
     res.redirect('/testimonials');
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.testimonialTable = async (req, res) => {
  try {
    const Testimonial = await prisma.testimonial.findMany();
    // Render the EJS page with the fetched frame and header data
    res.render('pages/testimonialTable', {
      Testimonial, // Pass header data to the EJS template
      title: "Testimonial Table",
      page: "Testimonial Table",
      requiredJs: false,
      currentPath: req.path
    });
  } catch (error) {
    console.error('Error fetching Update Testimonial Table:', error);
    req.app.get('logger')?.error('Error fetching Testimonial Table:', error);
    res.status(500).send('Internal Server Error');
  }
};


exports.deleteTestimonial = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        // Find the frame to get the image path
        const testimonials = await prisma.testimonial.findUnique({
            where: { id: id },
        });

        if (!testimonials) {
            req.app.get('logger')?.error('Error testimonial not found:');
            return res.status(404).json({ success: false, message: 'testimonial not found' });
        }

        // Delete the image from the uploads folder
        const imagePath = path.join(__dirname, '../../public/testimonial', testimonials.author_image);
        console.log('Attempting to delete:', imagePath); // Debugging log

        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return res.status(500).json({ success: false, message: 'Error deleting file' });
                }
                console.log('File deleted successfully:', imagePath);
            });
        } else {
            req.app.get('logger')?.error('Error file not found :', imagePath);
            console.warn('File not found, skipping delete:', imagePath);
        }


        // Delete the frame from the database
        await prisma.testimonial.delete({
            where: { id: id },
        });

        res.json({ success: true, message: 'testimonials deleted successfully' });
    } catch (error) {
        console.error('Error deleting testimonials:', error);
        req.app.get('logger')?.error('Error delete testimonials:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const testimonialId = parseInt(req.params.id);
    const { author_name, author_designation, description, link } = req.body;

    // Validate required fields
    if (!author_name || !author_designation || !description || !link) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: author_name, author_designation, description, link.',
      });
    }

    // Find existing testimonial
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id: testimonialId },
    });

    if (!existingTestimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    // Check for new image upload
    let author_image = existingTestimonial.author_image; // Default to existing image
     // If new image uploaded, delete the old one
     if (req.file) {
      author_image = req.file.filename;

      // Construct old image path
      const oldImagePath = path.join(__dirname, '../../public/testimonial', existingTestimonial.author_image);

      // Check if old image exists and delete it
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log('Old image deleted:', oldImagePath);
      } else {
        console.log('Old image not found:', oldImagePath);
      }
    }

    // Update the testimonial
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: testimonialId },
      data: {
        author_name,
        author_designation,
        description,
        link,
        author_image,
      },
    });

    res.redirect('/get-testimonial-table'); // Redirect to the testimonial list or desired page
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.testimonialGetApi = async (req, res) => {
  try {
    const testimonial = await prisma.testimonial.findMany();
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error fetching Update Testimonial Table:', error);
    req.app.get('logger')?.error('Error fetching Testimonial Table:', error);
    res.status(500).send('Internal Server Error');
  }
};

// subscription start

exports.createSubscription = async (req, res) => {
  try {
    const { email } = req.body;
    // Input validation: Check if required fields are provided
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: email.',
      });
    }

    // Check if email already exists
    const existingSubscription = await prisma.subscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: 'Email already subscribed.',
      });
    }

    const newSubscription = await prisma.subscription.create({
      data: {
        email,
      }
    });

    // Respond with the newly created subscription
    res.status(201).json({ success: true, data: newSubscription });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}

// get all subscription 

exports.getSubscribe = async (req, res) => {
  try {
    const subscription = await prisma.subscription.findMany();
    res.render('pages/subscriptionTable', {
      subscription, // Pass header data to the EJS template
      title: "Subscription Table",
      page: "Subscription Table",
      requiredJs: false,
      currentPath: req.path
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// delete subscription

exports.deleteSubscription = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
      // Find the frame to get the image path
      const subscription = await prisma.subscription.findUnique({
          where: { id: id },
      });

      if (!subscription) {
          req.app.get('logger')?.error('Error subscription not found:');
          return res.status(404).json({ success: false, message: 'subscription not found' });
      }

      // Delete the frame from the database
      await prisma.subscription.delete({
          where: { id: id },
      });

      res.json({ success: true, message: 'subscription deleted successfully' });
  } catch (error) {
      console.error('Error deleting subscription:', error);
      req.app.get('logger')?.error('Error delete subscription:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

// whyChosoeUsFirst

exports.createWhyChooseUsFirst = async (req, res) => {
  try {
    const { tabName } = req.body;

    if (!tabName) {
      return res.status(400).json({
        success: false,
        message: 'Tab Name is required',
      });
    }

    // Validate and process uploaded images
    const images = [];
    const files = req.files; // Object containing all uploaded images by multer

    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required',
      });
    }

    // Loop through files to extract filenames
    Object.keys(files).forEach((key) => {
      const fileArray = files[key];
      if (fileArray && fileArray.length > 0) {
        const file = fileArray[0];
        images.push(file.filename);
      }
    });

    // Ensure there are exactly 4 images (if that's the rule)
    if (images.length !== 4) {
      return res.status(400).json({
        success: false,
        message: 'Exactly 4 images are required for each tab.',
      });
    }

    // Save to Prisma (JSON format for images)
    const newWhyChooseUsFirst = await prisma.whyChooseUsFirst.create({
      data: {
        tabName,
        tabImages: images, // Prisma will store as JSON
      },
    });
res.redirect('/get-why-choose-first');
    
  } catch (error) {
    console.error('Error creating WhyChooseUsFirst:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.whyChooseUsFirstTable = async (req, res) => {
  try {
    const whyChooseUsTable1 = await prisma.whyChooseUsFirst.findMany();
    // Render the EJS page with the fetched frame and header data
    res.render('pages/whyChooseUsFirstTable', {
      whyChooseUsTable1, // Pass header data to the EJS template
      title: "Why Choose Us Table",
      page: "whyChooseUsTableFirst Table",
      requiredJs: false,
      currentPath: req.path
    });
  } catch (error) {
    console.error('Error fetching Update whyChooseUsTable1 Table:', error);
    req.app.get('logger')?.error('Error fetching whyChooseUsTable1:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateWhyChooseUsFirst = async (req, res) => {
  const whyChooseId = parseInt(req.params.id); // or req.params.whyChooseId depending on your route param
  
  try {
    const { tabName } = req.body;

    // Validate
    if (!tabName) {
      return res.status(400).json({
        success: false,
        message: 'Tab Name is required',
      });
    }

    // Fetch the existing record
    const existingRecord = await prisma.whyChooseUsFirst.findUnique({
      where: { id: whyChooseId },
    });

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    // Process images
    const updatedImages = []; // New array to hold final image names
    const files = req.files; // multer stores files in req.files (when using upload.fields([...]) )

    const existingImages = existingRecord.tabImages; // Array of current image filenames

    // Loop through the potential 4 images
    for (let i = 0; i < existingImages.length; i++) {
      const fieldName = `tabImages[${i}][tabImages]`;

      if (files && files[fieldName] && files[fieldName].length > 0) {
        // New image uploaded, delete old image file from the folder
        const oldImagePath = path.join(__dirname, '../../public/why-choose-us/', existingImages[i]);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          // console.log(`Deleted old image: ${existingImages[i]}`);
        }

        // Push new image filename
        updatedImages.push(files[fieldName][0].filename);
      } else {
        // No new image uploaded, keep the existing image
        updatedImages.push(existingImages[i]);
      }
    }

    // Now update the record
    const updatedRecord = await prisma.whyChooseUsFirst.update({
      where: { id: whyChooseId },
      data: {
        tabName,
        tabImages: updatedImages,
      },
    });

    // Redirect or JSON response
    res.redirect('/why-choose-us-first-table');
    // OR res.json({ success: true, data: updatedRecord });

  } catch (error) {
    console.error('Error updating WhyChooseUsFirst:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

exports.deleteWhyChooseFirst = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
      // Find the frame to get the image path
      const whyChoose1 = await prisma.whyChooseUsFirst.findUnique({
          where: { id: id },
      });

      if (!whyChoose1) {
          req.app.get('logger')?.error('Error whyChoose1 not found:');
          return res.status(404).json({ success: false, message: 'whyChoose1 not found' });
      }

      // Delete the frame from the database
      await prisma.whyChooseUsFirst.delete({
          where: { id: id },
      });

      res.json({ success: true, message: 'whyChoose1 deleted successfully' });
  } catch (error) {
      console.error('Error deleting whyChoose1:', error);
      req.app.get('logger')?.error('Error delete subscription:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

exports.whyChooseUsFirstGetApi = async (req, res) => {
  try {
    const whyChosoeFirst = await prisma.whyChooseUsFirst.findMany();
    res.status(200).json({ success: true, data: whyChosoeFirst });
  } catch (error) {
    console.error('Error fetching Update whyChosoeFirst :', error);
    req.app.get('logger')?.error('Error fetching whyChosoeFirst:', error);
    res.status(500).send('Internal Server Error');
  }
};