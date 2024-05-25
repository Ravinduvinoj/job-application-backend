const TempUser = require('../../models/userModel/tempuser');
const nodemailer = require('nodemailer');
const User = require('../../models/userModel/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const approve_user= async (req, res) => {
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
};



const approve_tempacc= async (req, res) => {
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
};

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

const directr_reg=async (req, res) => {
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

module.exports={
    approve_tempacc,
    approve_user,
    directr_reg
}

