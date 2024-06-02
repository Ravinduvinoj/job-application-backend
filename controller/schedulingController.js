const Schedule = require('../models/SchedulingModel/schedulemodel')
const Application = require('../models/applicationModel/applicationModel');
const moment = require('moment');

const setschedule = async (req, res) => {
    try {
      const applicationId = req.params._id; // Assuming the application ID is passed as a URL parameter
      
      const { interiview_date, description, location, interiview_time } = req.body;
  
      // Validate the incoming data
      if (!interiview_date || !description || !location || !interiview_time) {
        return res.status(400).json({ message: 'All fields are required' });
      }
  
      // Create a new schedule
      const newSchedule = new Schedule({
        location,
        description,
        interiview_date, // Assuming it's correctly formatted
        interiview_time, // Assuming it's correctly formatted
        application: applicationId
      });
  
      // Save the new schedule
      const savedSchedule = await newSchedule.save();
      console.log('Schedule saved:', savedSchedule);
  
      // Update the application status to "approved"
      const updatedApplication = await Application.findByIdAndUpdate(applicationId, { status: 'approved' }, { new: true });
      console.log('Updated Application:', updatedApplication);
  
      if (!updatedApplication) {
        return res.status(404).json({ message: 'Application not found' });
      }
  
      res.status(201).json({ message: 'Schedule created and application approved', schedule: savedSchedule });
    } catch (error) {
      console.error('Error setting schedule:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};
const getAllSchedulesWithJobSeekerAndApplication = async (req, res) => {
    try {
        const schedules = await Schedule.find().populate({
            path: 'application',
            populate: {
                path: 'jobseeker',
                model: 'jobseeker' // Assuming the model name is 'jobseeker'
            }
        });
        res.status(200).json({ schedules });
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
  module.exports = { setschedule,
    getAllSchedulesWithJobSeekerAndApplication
   };