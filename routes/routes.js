const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Router } = require('express');
const moment = require('moment');
const cron = require('node-cron');


const tempadd = require ('.././models/advertiesmentModel/tempaddveritesmentModel')

const sentEmail = require('../controller/Email/RegEmailController')
const addpostController = require('../controller/advertiesmentController');
const companyuserController = require('../controller/CompanyUserController');
const tempRegController = require('../controller/tempRegController');
const JobCategoryController = require('../controller/jobCategoryController');
const jobSubCategoryController = require('../controller/JobSubCategoryController');
const jobseekerController = require('../controller/jobseekerController');
const applicationController = require('../controller/applicationController');
const listiningController = require('../controller/joblistningController')
const scheduleController = require('../controller/schedulingController')

const router = Router();

router.post('/temp-register', companyuserController.temp_registerUser);
router.post('/login', companyuserController.login);
router.get('/user', companyuserController.user); // Authentication needed
router.get('/user-accounts', companyuserController.getAllUserAccounts);
router.get('/delete-useracc/:email', companyuserController.delete_useracc);
router.put('/update-user/:email', companyuserController.update_user);
router.get('/getalltempuser', companyuserController.getTempUser);
router.post('/logout',companyuserController.logout);
router.get('/companycount',companyuserController.companyCount)

router.get('/delete-tempacc/:email',tempRegController.deletetemp_acc);

//sending emails in these routes
router.post('/approve-user/:email',sentEmail.approve_user);
router.get('/approve-tempacc/:email',sentEmail.approve_tempacc);
router.post('/direct-register',sentEmail.directr_reg);

router.post('/addcategory', JobCategoryController.addCategory);
router.get('/get-all-category', JobCategoryController.getAllJobCategory);
router.put('/update-Category/:jobCategory', JobCategoryController.updateCategory);

router.post('/add-subcategory/:categoryId', jobSubCategoryController.addSubCategory);
router.get('/get-all-Sub-Categories', jobSubCategoryController.getAllSubJobCategory);
router.put('/update-sub-catgory/:subcategory', jobSubCategoryController.updateSubCategory);
router.get('/getselectedmaincategory/:id', jobSubCategoryController.getSelectedMainCategory);

router.get('/add-display/:id', addpostController.displaypost);
router.get('/displayPost', addpostController.displayAllpost);
router.get('/post/delete/:id', addpostController.delete_post);
router.get('/adCount', addpostController.AddCount);


router.post('/jobseeker/register', jobseekerController.regjobseeker);
router.post('/jobseeker/login', jobseekerController.loginjobseeker);
router.post('/jobseeker/logout', jobseekerController.logout);
router.get('/Jobseeker-Count', jobseekerController.SeekersCount);


router.get('/temp/advertiesment',addpostController.displayAlltemppost);
router.get('/temp/approve/:_id',addpostController.approv_ad);
router.get('/post/show/:id',addpostController.getAd);
router.get('/post/showcount/:_id',addpostController.empComCount);

router.post('/jobseeker/apply/:ad_id',applicationController.apply);
router.get('/appCount', applicationController.appCount);


router.get('/get-application/:_id',listiningController.getapplied);
router.get('/get/status/:advertId',listiningController.getAllApplicationsByAdvertAndStatus)

router.post('/app/schedule/:_id',scheduleController.setschedule);
router.get('/get/schedule/:login_id',scheduleController.getAllSchedulesWithJobSeekerAndApplication);
router.put('/reject/schedule/:_id',scheduleController.rejectApplication)
router.get('/appCountApproval/:_id', scheduleController.countApproved);

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

const { deleteExpiredAdvertisements } = require('../controller/advertiesmentController');

// Schedule the job to run every day at midnight IST
cron.schedule('0 0 * * *', async () => {
  console.log('Running deleteExpiredAdvertisements job');
  await deleteExpiredAdvertisements();
}, {
  scheduled: true,
  timezone: "Asia/Kolkata" // India Standard Time
});

module.exports = router;