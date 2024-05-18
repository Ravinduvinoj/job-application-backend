
const User = require('../models/userModel/user');
const addPost = require('../models/advertiesmentModel/addvertiesmentModel');


const addPostData = async (req, res) => {



  try {
    const upload = new addPost({
      // add_file: req.body.image,
      job_title: req.body.jobtitle,
      job_description: req.body.jobDescription,
      ad_closing_date: req.body.add_closing_Date,
      position_summary: req.body.possitionSummary,
      requirement1: req.body.requirement1,
      requirement2: req.body.requirement2,
      country: req.body.çountry,
      city: req.body.city,
      JobCategory: req.body.Maincategory,
      jobsubcategory: req.body.SubCategory,
      User: req.body.login_id
    });


    const result = await upload.save();
    console.log(result)
    res.json({ message: 'data uploaded successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading data.' });
  }
}


const displaypost = async (req, res) => {
  try {
    const loginID = req.params.id;
    console.log('dfdfdf'+loginID)
    const post = await addPost.find({ User: loginID }).populate('job_title');
    if(!post){
      res.status(401).json({ message: 'no any post created' });
    }
    console.log(post)
    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching addvertiesment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const displayAllpost = async (req, res) => {
  try {

    const posts = await addPost.find();
    return res.status(200).send({
      message: "Success",
      data: posts,
    });
  } catch (error) {
    console.error('Error fetching addvertiesment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






module.exports = {
  addPostData,
  displaypost,
  displayAllpost
}
