const moment = require('moment');
const User = require('../models/userModel/user');
const addPost = require('../models/advertiesmentModel/addvertiesmentModel');
const tempadd = require ('.././models/advertiesmentModel/tempaddveritesmentModel')
const Application = require('../models/applicationModel/applicationModel');
const mongoose = require('mongoose');

const displaypost = async (req, res) => {
  try {
    const loginID = req.params.id;
    console.log('Fetching posts for user ID: ' + loginID);

    // Fetch and count applications for each post by the specific user
    const posts = await addPost.aggregate([
      {
        $match: { User: new mongoose.Types.ObjectId(loginID) } // Match posts by user ID
      },
      {
        $lookup: {
          from: 'application', // Ensure this matches the actual collection name
          localField: '_id',
          foreignField: 'advertiesment',
          as: 'applications'
        }
      },
      {
        $addFields: {
          applications_count: { $size: '$applications' }
        }
      },
      {
        $sort: { post_date: -1 }
      }
    ]);

    if (!posts || posts.length === 0) {
      return res.status(401).json({ message: 'No posts created' });
    }

    // Format the ad_closing_date and post_date for each post
    const formattedPosts = posts.map(post => {
      const formattedPost = {
        ...post,
        ad_closing_date: moment(post.ad_closing_date).format('YYYY-MM-DD'),
        post_date: moment(post.post_date).format('YYYY-MM-DD')
      };
      return formattedPost;
    });

    res.status(200).json(formattedPosts);
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// const displayAllpost = async (req, res) => {
//   try {
//     const posts = await addPost.find();
//     const dateString = posts.ad_closing_date;
//     const formattedDate = moment(dateString).format('YYYY-MM-DD');
//     posts.ad_closing_date = formattedDate;
//     console.log(formattedDate);
//     return res.status(200).send({
//       message: "Success",
//       data: posts,
//     });
//   } catch (error) {
//     console.error('Error fetching addvertiesment:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
const displayAllpost = async (req, res) => {
  try {
    // Fetch and sort the posts by post_date in descending order
    const posts = await addPost.aggregate([
      {
        $lookup: {
          from: 'application', // Ensure this matches the actual collection name
          localField: '_id',
          foreignField: 'advertiesment',
          as: 'applications'
        }
      },
      {
        $addFields: {
          applications_count: { $size: '$applications' }
        }
      },
      {
        $sort: { post_date: -1 }
      }
    ]);

    // Format the ad_closing_date and post_date for each post
    const formattedPosts = posts.map(post => {
      const formattedPost = {
        ...post,
        ad_closing_date: moment(post.ad_closing_date).format('YYYY-MM-DD'),
        post_date: moment(post.post_date).format('YYYY-MM-DD')
      };
      return formattedPost;
    });

    return res.status(200).send({
      message: "Success",
      data: formattedPosts
    });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
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
 // Format the ad_closing_date and post_date for each post
 const formattedPosts = posts.map(post => {
  const formattedPost = post.toObject();
  formattedPost.ad_closing_date = moment(post.ad_closing_date).format('YYYY-MM-DD');
  formattedPost.post_date = moment(post.post_date).format('YYYY-MM-DD');
  return formattedPost;
});

return res.status(200).send({
  message: "Success",
  data: formattedPosts,
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
const deleteExpiredAdvertisements = async () => {
  try {
    const currentDate = moment().startOf('day').toDate();
    const result = await addPost.deleteMany({ ad_closing_date: { $lt: currentDate } });
    console.log(`Deleted ${result.deletedCount} expired advertisements.`);
  } catch (error) {
    console.error('Error deleting expired advertisements:', error);
  }
};
const AddCount = async(req,res)=>{

  try {
      const addCount = await addPost.countDocuments();
      res.status(200).json({ count: addCount });
  } catch (error) {
      console.error('Error counting ad:', error);
      res.status(500).json({ message: 'Internal server error' });
  }

}
const empComCount = async(req,res)=>{

  try {
      const postCount = await addPost.countDocuments({User:req.params._id});
      res.status(200).json({ count: postCount });
  } catch (error) {
      console.error('Error counting ad', error);
      res.status(500).json({ message: 'Internal server error' });
  }

}


module.exports = {
  displaypost,
  displayAllpost,
  delete_post,
  displayAlltemppost,
  approv_ad,
  getAd,
  deleteExpiredAdvertisements,
  AddCount,
  empComCount
}
