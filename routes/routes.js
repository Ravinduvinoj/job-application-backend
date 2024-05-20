const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const moment = require('moment');
const tempadd = require ('.././models/advertiesmentModel/tempaddveritesmentModel')


const addPost = require('../models/advertiesmentModel/addvertiesmentModel');
const addpostController = require('../controller/advertiesmentController');
const User = require('../models/userModel/user');
const TempUser = require('../models/userModel/tempuser');
const companyuserController = require('../controller/CompanyUserController');
const JobCategoryController = require('../controller/jobCategoryController');
const jobSubCategoryController = require('../controller/JobSubCategoryController');
const jobseekerController = require('../controller/jobseekerController');

const router = Router();

router.post('/temp-register', companyuserController.temp_registerUser);
router.post('/login', companyuserController.login);
router.get('/user', companyuserController.user); // Authentication needed
router.get('/user-accounts', companyuserController.getAllUserAccounts);
router.get('/delete-useracc/:email', companyuserController.delete_useracc);
router.put('/update-user/:email', companyuserController.update_user);

router.post('/addcategory', JobCategoryController.addCategory);
router.get('/get-all-category', JobCategoryController.getAllJobCategory);
router.put('/update-Category/:jobCategory', JobCategoryController.updateCategory);

router.post('/add-subcategory/:categoryId', jobSubCategoryController.addSubCategory);
router.get('/get-all-Sub-Categories', jobSubCategoryController.getAllSubJobCategory);
router.put('/update-sub-catgory/:subcategory', jobSubCategoryController.updateSubCategory);
router.get('/getselectedmaincategory/:id', jobSubCategoryController.getSelectedmainCategory);

router.get('/add-display/:id', addpostController.displaypost);
router.get('/displayPost', addpostController.displayAllpost);
router.get('/post/delete/:id', addpostController.delete_post);

router.post('/jobseeker/register', jobseekerController.regjobseeker);
router.post('/jobseeker/login', jobseekerController.loginjobseeker);
router.post('/jobseeker/logout', jobseekerController.logout);

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'Images/';
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure the directory exists
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

// Initialize multer with options
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB
  },
  fileFilter: fileFilter,
});

router.post('/add-post', upload.single('image'), async (req, res) => {

    const dateString = req.body.ad_closing_date;
    const formattedDate = moment(dateString).format('YYYY-MM-DD');
    console.log(formattedDate); 

  try {
    
    const newPost = new tempadd({
      job_title: req.body.job_title,
      job_description: req.body.job_description,
      ad_closing_date: formattedDate,
      position_summary: req.body.position_summary,
      requirement1: req.body.requirement1,
      requirement2: req.body.requirement2,
      country: req.body.country,
      city: req.body.city,
      JobCategory: req.body.JobCategory,
      jobsubcategory: req.body.jobsubcategory,
      User: req.body.User,
      image: req.file ? req.file.path : '',
    });

    const result = await newPost.save();
    res.json({ message: 'Data uploaded successfully!', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading data.' });
  }
});

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const imagePath = `/Images/${req.file.filename}`; // Corrected path
  res.json({ imagePath });
});




router.post('/direct-register', async (req, res) => {
    // res.send("create a new user");
    let email = req.body.email;
    let password = req.body.password;
    let company = req.body.company;
    let contact = req.body.contact;
    let userRole = req.body.userRole;
    let city = req.body.city;
    let address = req.body.address;
    let companyurl = req.body.companyurl;
    const salt1 = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt1);


    const record = await User.findOne({ email: email });
    const record2 = await TempUser.findOne({ email: email });
    const contactTemp = await TempUser.findOne({ contact: contact });
    const contactUser = await User.findOne({ contact: contact })
    const tempcompany = await TempUser.findOne({ company: company })
    const usercompany = await User.findOne({ company: company })


    if (record || record2) {
        return res.status(400).send({
            message: "email already exists",
        });
    } else if (contactTemp || contactUser) {
        return res.status(400).send({
            message: "contact number already exists",
        });

    } else if (tempcompany || usercompany) {
        return res.status(400).send({
            message: "company already exists",
        });
    }

    else {
        const Tuser = new User({
            company: company,
            contact: contact,
            email: email,
            password: hashedPassword,
            userRole: userRole,
            city: city,
            address: address,
            companyurl: companyurl
        })
        const result = await Tuser.save();
        console.log(result);
        await sendRegEmail(email, password)

        res.send({
            message: "successfully",
        })

    }
})




router.post('/logout', (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 })
    res.send({
        message: "successfully",
    })
})



router.get('/getalltempuser', async (req, res) => {
    try {
        const tempUsers = await TempUser.find({});

        res.send(tempUsers);
    } catch (error) {

        res.status(500).send({
            message: 'Error retrieving temp users',
            error: error.message
        });
    }
});
router.get('/delete-tempacc/:email', async (req, res) => {
    const userEmail = req.params.email;

    try {
        // Find the temp user by email and delete it
        const deletedUser = await TempUser.findOneAndDelete({ email: userEmail });

        if (!deletedUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});



router.post('/approve-user/:email', async (req, res) => {
    const userEmail = req.params.email;

    try {
        // Find the user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user status to approved (you might have a 'status' field in your User model)
        user.status = 'approved';
        await user.save();

        // Send email to the user
        await sendApprovalEmail(userEmail);

        res.status(200).json({ message: 'User approved and email sent successfully' });
    } catch (error) {
        console.error('Error approving user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/approve-tempacc/:email', async (req, res) => {
    const userEmail = req.params.email;

    try {
        // Find the temp user by email
        const tempUser = await TempUser.findOne({ email: userEmail });

        if (!tempUser) {
            return res.status(404).send({ message: 'Temp user not found' });
        }

        // Create a new user instance using data from the temp user
        const newUser = new User({
            company: tempUser.company,
            contact: tempUser.contact,
            email: tempUser.email,
            password: tempUser.password, // You might want to hash the password again if needed
            userRole: tempUser.userRole,
            city: tempUser.city,
            address: tempUser.address,
            companyurl: tempUser.companyurl
        });

        // Save the new user to the user account collection
        await newUser.save();

        // Delete the temp user from the temp user collection
        await TempUser.findOneAndDelete({ email: userEmail });

        // Send approval email to the user
        sendApprovalEmail(userEmail);

        res.status(200).send({ message: 'User approved and moved to user account collection successfully' });
    } catch (error) {
        console.error('Error approving temp user:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Function to send approval email
async function sendApprovalEmail(userEmail) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'greenjobs2024@gmail.com',
                pass: 'fccp htcw qqdr syqb',
            },
        });

        await transporter.sendMail({
            from: 'greenjobs2024@gmail.com',
            to: userEmail,
            subject: 'Account Approved',
            text: `Your company account has been approved . 


                    Your email is : ${userEmail} 
                    
                    You can now log in and access our services.`,
        });
    } catch (error) {
        console.error('Error sending approval email:', error);
        throw error;
    }
}
async function sendRegEmail(userEmail, password) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'greenjobs2024@gmail.com',
                pass: 'fccp htcw qqdr syqb',
            },
        });

        await transporter.sendMail({
            from: 'greenjobs2024@gmail.com',
            to: userEmail,
            subject: 'Account Registration',
            text: `Your account has been Registerd . 


                    Your email is : ${userEmail} 
                    your password is : ${password}
                    
                    You can now log in and access our services.`,
        });
    } catch (error) {
        console.error('Error sending approval email:', error);
        throw error;
    }
}


module.exports = router;