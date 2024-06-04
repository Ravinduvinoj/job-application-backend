const Schedule = require('../models/SchedulingModel/schedulemodel')
const Application = require('../models/applicationModel/applicationModel');
const moment = require('moment');
const nodemailer = require('nodemailer');
const User = require('../models/userModel/user')
const mongoose = require('mongoose');
const Advertiesment = require('../models/advertiesmentModel/addvertiesmentModel');

const setschedule = async (req, res) => {
    try {
        const { login_id, interiview_date, description, location, interiview_time, email } = req.body;
        const applicationId = req.params._id; // Assuming the application ID is passed as a URL parameter

        // Validate the incoming data
        if (!login_id || !interiview_date || !description || !location || !interiview_time) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate login_id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(login_id)) {
            return res.status(400).json({ message: 'Invalid login ID' });
        }

        // Create a new schedule
        const newSchedule = new Schedule({
            location,
            description,
            interiview_date, // Assuming it's correctly formatted
            interiview_time, // Assuming it's correctly formatted
            application: applicationId,
            loginID: login_id // Save the loginID
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

        // Send approval email (assuming you have a function to do this)
        sendApprovalEmail(email, interiview_date, interiview_time, location, description);

        res.status(201).json({ message: 'Schedule created and application approved', schedule: savedSchedule });
    } catch (error) {
        console.error('Error setting schedule:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


async function sendApprovalEmail(email, interiview_date, interiview_time, location, description) {
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
            to: email,
            subject: 'Face to Interview',
            text: `Your job position interview has been scheduled. 


                    Your email is : ${email} 
                    
                    The interview will be held on
                     ${interiview_date} 
                     at
                      ${interiview_time} 
                      noon at ${location}.
                    
                      ${description}
                    `,
        });
    } catch (error) {
        console.error('Error sending approval email:', error);
        throw error;
    }
}
const getAllSchedulesWithJobSeekerAndApplication = async (req, res) => {
    try {
        const loginId = req.params.login_id;

        // Validate loginId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(loginId)) {
            return res.status(400).json({ message: 'Invalid login ID' });
        }

        const schedules = await Schedule.find({ loginID: loginId }) // Filter by loginID
            .populate({
                path: 'application',
                populate: [
                    {
                        path: 'jobseeker',
                        model: 'jobseeker' // Assuming the model name is 'jobseeker'
                    },
                    {
                        path: 'advertiesment',
                        model: 'advertiesment' // Assuming the model name is 'advertiesment'
                    }
                ]
            })
            .sort({ interiview_date: -1, interiview_time: -1 }); // Sort by interview_date and interview_time in descending order

        res.status(200).json({ schedules });
    } catch (error) {
        console.error('Error fetching schedules:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const rejectApplication = async (req, res) => {
    try {
        const applicationId = req.params._id; // Assuming the application ID is passed as a URL parameter

        // Update the application status to "rejected"
        const updatedApplication = await Application.findByIdAndUpdate(applicationId, { status: 'rejected' }, { new: true });

        if (!updatedApplication) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(200).json({ message: 'Application rejected successfully', application: updatedApplication });
    } catch (error) {
        console.error('Error rejecting application:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




module.exports = {
    rejectApplication,
    setschedule,
    getAllSchedulesWithJobSeekerAndApplication
};