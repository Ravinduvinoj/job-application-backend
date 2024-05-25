const moment = require('moment');
const User = require('../models/userModel/user');
const addPost = require('../models/advertiesmentModel/addvertiesmentModel');
const tempadd = require ('.././models/advertiesmentModel/tempaddveritesmentModel')

// const addPostData = async (req, res) => {
//   try {
//     const upload = new tempadd({
//       // add_file: req.body.image,
//       job_title: req.body.jobtitle,
//       job_description: req.body.jobDescription,
//       ad_closing_date: req.body.add_closing_Date,
//       position_summary: req.body.possitionSummary,
//       requirement1: req.body.requirement1,
//       requirement2: req.body.requirement2,
//       country: req.body.çountry,
//       city: req.body.city,
//       JobCategory: req.body.Maincategory,
//       jobsubcategory: req.body.SubCategory,
//       User: req.body.login_id
//     });

//     const result = await upload.save();
//     console.log(result)
//     res.json({ message: 'data uploaded successfully!' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error uploading data.' });
//   }
// }

const displaypost = async (req, res) => {
  try {
    const loginID = req.params.id;
    console.log('dfdfdf' + loginID)
    const post = await addPost.find({ User: loginID }).populate('job_title');
    if (!post) {
      res.status(401).json({ message: 'no any post created' });
    }
    const dateString = post.ad_closing_date;
    const formattedDate = moment(dateString).format('YYYY-MM-DD');
    post.ad_closing_date = formattedDate;
    console.log(formattedDate);

    res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching addvertiesment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const displayAllpost = async (req, res) => {
  try {
    const posts = await addPost.find();
    const dateString = posts.ad_closing_date;
    const formattedDate = moment(dateString).format('YYYY-MM-DD');
    posts.ad_closing_date = formattedDate;
    console.log(formattedDate);
    return res.status(200).send({
      message: "Success",
      data: posts,
    });
  } catch (error) {
    console.error('Error fetching addvertiesment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const delete_post = async (req, res) => {
  const post_id = req.params.id;

  try {
    // Find the temp user by email and delete it
    const deleteadd = await addPost.findOneAndDelete({ _id: post_id });

    if (!deleteadd) {
      return res.status(404).send({ message: 'post not found' });
    }

    res.status(200).send({ message: 'post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

const displayAlltemppost = async (req, res) => {
  try {
    const posts = await tempadd.find();
    const dateString = posts.ad_closing_date;
    const formattedDate = moment(dateString).format('YYYY-MM-DD');
    posts.ad_closing_date = formattedDate;
    console.log(formattedDate);
    return res.status(200).send({
      message: "Success",
      data: posts,
    });
  } catch (error) {
    console.error('Error fetching temp addvertiesment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const approv_ad= async (req, res) => {
  const id = req.params._id;

  try {
      // Find the temp ad by id
      const temppost = await tempadd.findOne({ _id: id });

      if (!temppost) {
          return res.status(404).send({ message: 'advertiesment not found' });
      }

      // Create a new ad instance using data from the temp ad
      const newAd = new addPost({

        job_title: temppost.job_title,
        job_description: temppost.job_description,
        ad_closing_date: temppost.ad_closing_date,
        position_summary: temppost.position_summary,
        requirement1: temppost.requirement1,
        requirement2: temppost.requirement2,
        country: temppost.country,
        city: temppost.city,
        JobCategory: temppost.JobCategory,
        jobsubcategory: temppost.jobsubcategory,
        User: temppost.User,
        image: temppost.image,
      });

      // Save the new add to the advertiesment collection
      await newAd.save();

      // Delete the temp ad from the temp ad collection
      await tempadd.findOneAndDelete({ _id: id });

      // Send approval email to the user
      // sendApprovalEmail(userEmail);

      res.status(200).send({ message: 'ad approved and moved to advertiesment collection successfully' });
  } catch (error) {
      console.error('Error approving advertisment:', error);
      res.status(500).send({ message: 'Internal server error' });
  }
};

const getAd = async (req, res) => {
  const id = req.params.id;
  console.log(id)
  try {
    const post = await addPost.findById({_id:id})

    if (!post) {
      return res.status(404).send({
        message: "Advertisement not found",
      });
    }

    return res.status(200).send({
      message: "Success",
      data: post,
    });
  } catch (error) {
    console.error('Error fetching advertisement:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = {
  displaypost,
  displayAllpost,
  delete_post,
  displayAlltemppost,
  approv_ad,
  getAd
}
