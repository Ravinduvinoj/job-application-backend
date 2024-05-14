const jobsekkerSchema = require('../models/userModel/jobSeekerModel')
const bcrypt = require('bcryptjs');
const jwt2 = require('jsonwebtoken');

const regjobseeker = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let job_Seeker_Name = req.body.jobseeker_name;
    let contact = req.body.contact;
    let userRole = req.body.userRole;
    let city = req.body.city;
    let address = req.body.address;
    let dob = req.body.dob;

    const user = await jobsekkerSchema.findOne({ email: email })
    const username = await jobsekkerSchema.findOne({ job_Seeker_Name: job_Seeker_Name })
    const salt1 = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt1);
    if (user) {
        return res.status(400).send({
            message: "email already exists",
        });
    } else if(username){
        return res.status(400).send({
            message: "user name already exists",
        });
    }else{
   
        const JSuser = new jobsekkerSchema({
            email: email,
            contact: contact,
            email: email,
            password: hashedPassword,
            userRole: userRole,
            city: city,
            address: address,
            job_Seeker_Name: job_Seeker_Name,
            dob:dob
        })
        const result = await JSuser.save();
        console.log(result);

        const { _id } = await result.toJSON();
        const token = jwt2.sign({ _id: _id }, "secret")

        res.cookie("jwt2", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        res.send({
            message: "successfully",
        })
    }
}

const loginjobseeker = async (req, res) => {

console.log( req.body.email)
    const user = await jobsekkerSchema.findOne({ email: req.body.email })
 
    if (!user) {
        return res.status(404).send({
            message: "user not found"
        })
    }
    if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(400).send({
            message: "incorrect password"
        });
    }else{
        const token = jwt2.sign({ _id: user._id }, "secret")

        res.cookie("jwt2", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        res.send({
            message: "successfully",
            userRole: user.userRole
        })
    }
}

const logout = (req, res) => {
    res.cookie("jwt2", "", { maxAge: 0 })
    res.send({
        message: "successfully",
    })
}




module.exports ={
    regjobseeker,
    loginjobseeker,
    logout
}

