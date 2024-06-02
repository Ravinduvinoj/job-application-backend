const application = require('../models/applicationModel/applicationModel')
const advertisement = require('../models/advertiesmentModel/addvertiesmentModel')
const jobUsers = require('../models/userModel/jobSeekerModel')

const upload = require('../middleware/upload');

exports.apply = async (req, res, next) => {
    upload(req, res, async function (err) {
        if (err) {
            console.log(err);
            return next(err);
        } else {
            try {
                const ad = req.params.ad_id;
                console.log(ad)
                // const url = req.protocol + "://" + req.get("host");
                const url = req.protocol + "://" + 'localhost:5000';
                const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";
                let status = 'pending';
                let jobseekerid = '6640cb055c5c7522955cf414';

                const findAd = await advertisement.findById(req.params.ad_id);
                const jobUserid = await jobUsers.findOne({ _id: jobseekerid });

                if (!findAd) {
                    return res.status(400).send({
                        message: "Advertisement not found, please check your advertisements are available",
                    });
                }
                if (!jobUserid) {
                    return res.status(400).send({
                        message: "User not found",
                    });
                }

                // Check if the application already exists for this jobseeker and advertisement
                const existingApplication = await application.findOne({
                    advertisement: req.params.ad_id,
                    jobseeker: jobseekerid
                });

                if (existingApplication) {
                    return res.status(400).send({
                        message: "You have already applied for this advertisement.",
                    });
                }

                const newApply = new application({
                    name: req.body.name,
                    address: req.body.address,
                    city: req.body.city,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    contact: req.body.contact,
                    status: status,
                    advertiesment: ad,
                    jobseeker: jobseekerid,
                    cvFile: path != "" ? url + "/" + path : "",
                });

                const result = await newApply.save();
                console.log(result);

                res.send({
                    message: "Application submitted successfully",
                });
            } catch (error) {
                console.error(error);
                res.status(500).send({
                    message: "An error occurred while processing your request",
                });
            }
        }
    });
};
