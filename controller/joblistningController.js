// controllers/applicationController.js
const application = require('../models/applicationModel/applicationModel');
const post = require('../models/advertiesmentModel/addvertiesmentModel');
const jobseeker = require('../models/userModel/jobSeekerModel'); // Correct path

const getapplied = async (req, res) => {
    try {
      console.log("Fetching applications for advertiesment ID:", req.params._id);
  
      // Find applications with the given advertiesment ID and "pending" status
      const checkAdd = await application.find({ 
        advertiesment: req.params._id, 
        status: 'pending' 
      }).populate({
        path: 'jobseeker',
        select: 'email job_Seeker_Name'
      });
  
      if (!checkAdd || checkAdd.length === 0) {
        console.log("No applications found for advertiesment ID:", req.params._id);
        return res.status(404).json({ message: 'No applications found' });
      }
  
      res.status(200).json(checkAdd);
      console.log("Applications found:", checkAdd);
    } catch (error) {
      console.error('Error fetching applications:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = {
  getapplied
};
