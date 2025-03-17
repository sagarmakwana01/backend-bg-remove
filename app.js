const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const winston = require('winston');
const debug = require('debug')('app:startup');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const apiForApp = require('./src/routers/api.route');
const apiForAdmin = require('./src/routers/app.route');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./prisma/index.js');
// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173'
  }));
// app.use(
//     helmet({
//       contentSecurityPolicy: {
//         directives: {
//           defaultSrc: ["'self'"],
  
//           // Allow inline and external scripts
//           scriptSrc: [
//             "'self'",
//             "'unsafe-inline'", // If inline scripts are needed
//             "'unsafe-eval'", // If eval() is needed
//           ],
  
//           // Allow external styles (Google Fonts, Ionic)
//           styleSrc: [
//             "'self'",
//             "'unsafe-inline'",
//             "https://fonts.googleapis.com",
//             "https://code.ionicframework.com",
//           ],
  
//           // Allow external fonts (Google Fonts, Ionicons)
//           fontSrc: [
//             "'self'",
//             "https://fonts.googleapis.com",
//             "https://fonts.gstatic.com",
//             "https://code.ionicframework.com", // Allow Ionicons fonts
//           ],
  
//           // Allow images from self, data URIs, and blob URLs
//           imgSrc: [
//             "'self'",
//             "data:",
//             "blob:",
//           ],
  
//           // Allow favicon.ico loading
//           objectSrc: ["'none'"],
  
//           // Allow iframes only from self (modify as needed)
//           frameAncestors: ["'self'"],
  
//           // Allow media sources if needed (modify as necessary)
//           mediaSrc: ["'self'"],
  
//           // Allow WebSockets if needed
//           connectSrc: ["'self'", "ws://localhost:3000"], // Adjust for your WebSocket setup
//         },
//       },
//     })
//   );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const store = new PrismaSessionStore(
	prisma,
	{
		checkPeriod: 60 * 1000,  //ms
		dbRecordIdIsSessionId: true,
		dbRecordIdFunction: undefined,
	}
)

// Static folders
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// View engine setup
app.set('view engine', 'ejs');
app.use(expressLayouts); // Enable layouts
app.set('layout', 'layout'); // Default layout file

// Logger setup with Winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.File({ filename: 'error.log', level: 'error' })
    ]
});



if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

app.use(flash());
// Cookie parser    
app.use(cookieParser());

// Debugging
debug('Debugging is enabled');
app.use(session({
	secret: process.env.SECRETE,
	resave: false,
	saveUninitialized: false,
    store: store,
	cookie: {   
		 httpOnly: true,
		 maxAge: 1000 * 60 * 60 * 4, // 2 hours
		 secure: false
		 }
}));

const passportConfig = require('./config/passport');
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
	// res.set('Cache-Control', 'no-store')
	next()
});

app.use((req, res, next) => {
	res.locals.session = req.session
	res.locals.user = req.user
	next()
});

// Routes
app.use('/api/v1/', apiForApp);
app.use('/', apiForAdmin);
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
    logger.info(`Server is running on port ${port}`);
    debug(`Server is running on port ${port}`);
});