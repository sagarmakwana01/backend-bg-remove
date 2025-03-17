// const prisma = require('../../prisma/index'); // Ensure you have Prisma setup
// const { setFlash } = require('../utils/flash');
// const fs = require('fs');
// const path = require('path');

// // Handle multiple image upload and save each as a separate DB row
// exports.createFrames = async (req, res) => {
//     try {
//         const { month, baby } = req.body;
//         const paid = req.body.paid === 'on'; // Checkbox returns 'on' when checked

//         if (!req.files || req.files.length === 0) {
//             setFlash(res, 'error', 'No files uploaded');
//         }

//         // Insert each image as a separate row in the 
//         // database
//         const frames = await Promise.all(
//             req.files.map(async (file) => {
//                 return prisma.frames.create({
//                     data: {
//                         month: month,
//                         baby: baby,
//                         image: file.filename,
//                         paid: paid
//                     }
//                 });
//             })
//         );
//         setFlash(res, 'success', 'Frames created successfully');
//         res.redirect('/babyframe');
//     } catch (error) {
//         console.error(error);
//         req.app.get('logger')?.error('Internal server error', error);
//         setFlash(res, 'error', 'Internal Server Error');
//         res.redirect('/');
//     }
// };

// exports.frames_table = async (req, res) => {
//     try {
//         // Fetch all frames from the database
//         const frames = await prisma.frames.findMany();

//         // Render the EJS page with the fetched frame data
//         res.render('pages/framesTable', { frames, title: "Frames Table", page: "frames_table", requiredJs: false, currentPath: req.path });
//     } catch (error) {
//         console.error('Error fetching frames:', error);
//         req.app.get('logger')?.error('Error fetching frames:', error);
//         res.status(500).send('Internal Server Error');
//     }

// };
// exports.deleteFrame = async (req, res) => {
//     const frameId = parseInt(req.params.id);

//     try {
//         // Find the frame to get the image path
//         const frame = await prisma.frames.findUnique({
//             where: { id: frameId },
//         });

//         if (!frame) {
//             req.app.get('logger')?.error('Frame not found');
//             return res.status(404).json({ success: false, message: 'Frame not found' });
//         }

        
//         // Delete the image from the uploads folder
//         const imagePath = path.join(__dirname, '../../public/frame', frame.image);
//         if (fs.existsSync(imagePath)) {
//             fs.unlinkSync(imagePath);
//         }

//         // Delete the frame from the database
//         await prisma.frames.delete({
//             where: { id: frameId },
//         });

//         res.json({ success: true, message: 'Frame deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting frame:', error);
//         req.app.get('logger')?.error('Error deleting frames:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// };
// exports.getFrames = async (req, res) => {
//     try {
//         const { baby, paid, month } = req.query;

//         const filters = {};

//         if (baby) filters.baby = baby; // Filter by baby type
//         if (paid) filters.paid = paid === 'true'; // Convert to boolean
//         if (month) filters.month = month; // Filter by month
//         // if (birthday) filters.birthday = birthday_special; // Filter by birthday
//         const frames = await prisma.frames.findMany({
//             where: filters,
//             select: {
//                 id: true,
//                 month: true,
//                 baby: true,
//                 image: true,
//                 paid: true,
//                 createdAt: true
//             },
//             orderBy: {
//                 createdAt: 'desc'
//             }
//         });

//         res.json({ success: true, data: frames });
//     } catch (error) {
//         console.error('Error fetching frames:', error);
//         req.app.get('logger')?.error('Error fetching frames:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };

// // background controller start  
// exports.createBackgrounds = async (req, res) => {
//     try {
//         const paid = req.body.paid === 'on'; // Checkbox returns 'on' when checked

//         if (!req.files || req.files.length === 0) {
//             setFlash(res, 'error', 'No files uploaded');
//         }

//         // Insert each image as a separate row in the database
//         const BackGround = await Promise.all(
//             req.files.map(async (file) => {
//                 return prisma.backgrounds.create({
//                     data: {
//                         backgroundImage: file.filename,
//                         paid: paid
//                     }
//                 });
//             })
//         );
//         setFlash(res, 'success', 'Background created successfully');
//         res.redirect('/gatBackground');
//     } catch (error) {
//         console.error(error);
//         req.app.get('logger')?.error('Error Internal server error:', error);
//         setFlash(res, 'error', 'Internal Server Error');
//         res.redirect('/');
//     }
// };
// exports.backgroundTable = async (req, res) => {
//     try {
//         // Fetch all frames from the database
//         const Background = await prisma.backgrounds.findMany();

//         // Render the EJS page with the fetched frame data
//         res.render('pages/backgroundTable', { Background, title: "Background Table", page: "Background_Table", requiredJs: false, currentPath: req.path });
//     } catch (error) {
//         console.error('Error fetching background:', error);
//         req.app.get('logger')?.error('Error fetching background table:', error);
//         res.status(500).send('Internal Server Error');
//     }
// };

// exports.deleteBackground = async (req, res) => {
//     const backgroundId = parseInt(req.params.id);

//     try {
//         // Find the frame to get the image path
//         const background = await prisma.backgrounds.findUnique({
//             where: { id: backgroundId },
//         });

//         if (!background) {
//             req.app.get('logger')?.error('Error Background not found:');
//             return res.status(404).json({ success: false, message: 'background not found' });
//         }

//         // Delete the image from the uploads folder
//         const imagePath = path.join(__dirname, '../../public/background', background.backgroundImage);
//         console.log('Attempting to delete:', imagePath); // Debugging log
//         console.log('>>>>>>>>', background.backgroundImage); // Debugging log

//         if (fs.existsSync(imagePath)) {
//             fs.unlink(imagePath, (err) => {
//                 if (err) {
//                     console.error('Error deleting file:', err);
//                     return res.status(500).json({ success: false, message: 'Error deleting file' });
//                 }
//                 console.log('File deleted successfully:', imagePath);
//             });
//         } else {
//             req.app.get('logger')?.error('Error file not found :', imagePath);
//             console.warn('File not found, skipping delete:', imagePath);
//         }


//         // Delete the frame from the database
//         await prisma.backgrounds.delete({
//             where: { id: backgroundId },
//         });

//         res.json({ success: true, message: 'background deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting background:', error);
//         req.app.get('logger')?.error('Error delete background:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// };

// exports.getBackgroundApi = async (req, res) => {
//     try {
//         const { paid } = req.query;

//         const filters = {};

//         if (paid) filters.paid = paid === 'true'; // Convert to boolean
//         const backgrounds = await prisma.backgrounds.findMany({
//             where: filters,
//             select: {
//                 id: true,
//                 backgroundImage: true,
//                 paid: true,
//                 createdAt: true
//             },
//             orderBy: {
//                 createdAt: 'desc'
//             }
//         });

//         res.json({ success: true, data: backgrounds });
//     } catch (error) {
//         console.error('Error fetching background:', error);
//         req.app.get('logger')?.error('Error fetching background:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// }
// // background controller end

// exports.createSricker = async (req, res) => {
//     try {
//         const { category } = req.body;

//         if (!req.files || req.files.length === 0) {
//             setFlash(res, 'error', 'No files uploaded');
//         }

//         // Insert each image as a separate row in the database
//         const stickers = await Promise.all(
//             req.files.map(async (file) => {
//                 return prisma.sticker.create({
//                     data: {
//                         category,
//                         stickerImage: file.filename,

//                     }
//                 });
//             })
//         );
//         setFlash(res, 'success', 'Sticker created successfully');
//         res.redirect('/getFormsticker');
//     } catch (error) {
//         console.error(error);
//         req.app.get('logger')?.error('Error internal server error:', error);
//         setFlash(res, 'error', 'Internal Server Error');
//         res.redirect('/');
//     }
// };

// exports.sticker_table = async (req, res) => {
//     try {
//         // Fetch all frames from the database
//         const stickers = await prisma.sticker.findMany();

//         // Render the EJS page with the fetched frame data
//         res.render('pages/stickerTable', { stickers, title: "Sticker Table", page: "sticker_table", requiredJs: false, currentPath: req.path });
//     } catch (error) {
//         console.error('Error fetching sticker:', error);
//         req.app.get('logger')?.error('Error fetching sticker', error);
//         res.status(500).send('Internal Server Error');
//     }
// };

// exports.deleteSticker = async (req, res) => {
//     const stickerId = parseInt(req.params.id);

//     try {
//         // Find the frame to get the image path
//         const sticker = await prisma.sticker.findUnique({
//             where: { id: stickerId },
//         });

//         if (!sticker) {
//             req.app.get('logger')?.error('Error sticker not found');
//             return res.status(404).json({ success: false, message: 'sticker not found' });
//         }

//         // Delete the image from the uploads folder
//         const imagePath = path.join(__dirname, '../../public/stickers', sticker.stickerImage);
//         console.log('Attempting to delete:', imagePath); // Debugging log

//         if (fs.existsSync(imagePath)) {
//             fs.unlink(imagePath, (err) => {
//                 if (err) {
//                     console.error('Error deleting file:', err);
//                     return res.status(500).json({ success: false, message: 'Error deleting file' });
//                 }
//                 console.log('File deleted successfully:', imagePath);
//             });
//         } else {
//             console.warn('File not found, skipping delete:', imagePath);
//         }


//         // Delete the frame from the database
//         await prisma.sticker.delete({
//             where: { id: stickerId },
//         });

//         res.json({ success: true, message: 'sticker deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting sticker:', error);
//         req.app.get('logger')?.error('Error deleting sticker error:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// };

// exports.getStickerApi = async (req, res) => {
//     try {
//         const { category } = req.query;

//         const filters = {};



//         if (category) filters.category = category; // Filter by category
//         const stickers = await prisma.sticker.findMany({
//             where: filters,
//             select: {
//                 id: true,
//                 category: true,
//                 stickerImage: true,
//                 createdAt: true
//             },
//             orderBy: {
//                 createdAt: 'desc'
//             }
//         });

//         res.json({ success: true, data: stickers });
//     } catch (error) {
//         console.error('Error fetching sticker:', error);
//         req.app.get('logger')?.error('Error fetching sticker:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };

// // start template controller
// exports.createTemplate = async (req, res) => {
//     try {
//         const { BabyType, frameType } = req.body;
//         const paid = req.body.paid === 'on'; // Checkbox returns 'on' when checked

//         if (!req.files || req.files.length === 0) {
//             setFlash(res, 'error', 'No files uploaded');
//         }

//         // Insert each image as a separate row in the database
//         const templates = await Promise.all(
//             req.files.map(async (file) => {
//                 return prisma.template.create({
//                     data: {
//                         BabyType: BabyType,
//                         frameType: frameType,
//                         templateImage: file.filename,
//                         paid: paid
//                     }
//                 });
//             })
//         );
//         setFlash(res, 'success', 'Template created successfully');
//         res.redirect('/getFormTemplate');
//     } catch (error) {
//         console.error(error);
//         req.app.get('logger')?.error('Error internal server error:', error);
//         setFlash(res, 'error', 'Internal Server Error');
//         res.redirect('/');
//     }
// };

// exports.template_table = async (req, res) => {
//     try {
//         // Fetch all frames from the database
//         const templates = await prisma.template.findMany();

//         // Render the EJS page with the fetched frame data
//         res.render('pages/templateTable', { templates, title: "Template Table", page: "template_table", requiredJs: false, currentPath: req.path });
//     } catch (error) {
//         console.error('Error fetching templates:', error);
//         req.app.get('logger')?.error('Error fetching templates:', error);
//         res.status(500).send('Internal Server Error');
//     }

// };

// exports.deleteTemplate = async (req, res) => {
//     const templateId = parseInt(req.params.id);

//     try {
//         // Find the frame to get the image path
//         const templates = await prisma.template.findUnique({
//             where: { id: templateId },
//         });

//         if (!templates) {
//             req.app.get('logger')?.error('Error template not found');
//             return res.status(404).json({ success: false, message: 'template not found' });
//         }

//         // Delete the image from the uploads folder
//         const imagePath = path.join(__dirname, '../../public/templates', templates.templateImage);
//         console.log('Attempting to delete:', imagePath); // Debugging log

//         if (fs.existsSync(imagePath)) {
//             fs.unlink(imagePath, (err) => {
//                 if (err) {
//                     console.error('Error deleting file:', err);
//                     return res.status(500).json({ success: false, message: 'Error deleting file' });
//                 }
//                 console.log('File deleted successfully:', imagePath);
//             });
//         } else {
//             console.warn('File not found, skipping delete:', imagePath);
//         }


//         // Delete the frame from the database
//         await prisma.template.delete({
//             where: { id: templateId },
//         });

//         res.json({ success: true, message: 'template deleted successfully' });
//     } catch (error) {

//         console.error('Error deleting template:', error);
//         req.app.get('logger')?.error('Error deleting template:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// };

// exports.getTemplateApi = async (req, res) => {
//     try {
//         const { BabyType, paid, frameType } = req.query;

//         const filters = {};

//         if (BabyType) filters.BabyType = BabyType; // Filter by baby type
//         if (frameType) filters.frameType = frameType; // Filter by baby type
//         if (paid) filters.paid = paid === 'true'; // Convert to boolean
//         const templates = await prisma.template.findMany({
//             where: filters,
//             select: {
//                 id: true,
//                 BabyType: true,
//                 paid: true,
//                 frameType: true,
//                 templateImage: true,
//                 createdAt: true
//             },
//             orderBy: {
//                 createdAt: 'desc'
//             }
//         });

//         res.json({ success: true, data: templates });
//     } catch (error) {
//         console.error('Error fetching templates:', error);
//         req.app.get('logger')?.error('Error fetching templates:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };
