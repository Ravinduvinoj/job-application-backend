const { Router } = require('express');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');
const TempUser = require('../models/tempuser');
const nodemailer = require('nodemailer');
const router = Router();

router.post('/temp-register', async (req, res) => {
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

    if (record || record2) {
        return res.status(400).send({
            message: "email already exists",
        });
    } else {
        const Tuser = new TempUser({
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

        //JWT Token

        // const { _id } = await result.toJSON();
        // const token = jwt.sign({ _id: _id }, "secret")

        // res.cookie("jwt", token, {
        //     httpOnly: true,
        //     maxAge: 24 * 60 * 60 * 1000
        // })

        res.send({
            message: "successfully",
        })

    }
})

router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return res.status(404).send({
            message: "user not found"
        })
    }
    if (!(await bcrypt.compare(req.body.password, user.password))) {
        return res.status(400).send({
            message: "incorrect password"
        });
    }
    const token = jwt.sign({ _id: user._id }, "secret");

    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 //for one day
    });

    res.send({
        message: "successfully",
        userRole: user.userRole // usertype response
    });
})

router.get('/user', async (req, res) => {
    try {
        const cookie = req.cookies['jwt']

        const claims = jwt.verify(cookie, "secret")
        if (!claims) {
            return res.status(401).send({
                message: "unauthenticated"
            })
        }

        const user = await User.findOne({ _id: claims._id })

        const { password, ...data } = await user.toJSON()
        res.send(data)

    }
    catch (error) {
        return res.status(401).send({
            message: "unauthenticated"
        })
    }
});

router.post('/logout', (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 })
    res.send({
        message: "successfully",
    })
})

router.get('/getalltempuser', async (req, res) => {
    try {

        const tempUsers = await TempUser.find({});

        res.send(tempUsers);
    } catch (error) {

        res.status(500).send({
            message: 'Error retrieving temp users',
            error: error.message
        });
    }
});
router.get('/delete-tempacc/:email', async (req, res) => {
    const userEmail = req.params.email;

    try {
        // Find the temp user by email and delete it
        const deletedUser = await TempUser.findOneAndDelete({ email: userEmail });

        if (!deletedUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});
router.get('/delete-useracc/:email', async (req, res) => {
    const userEmail = req.params.email;

    try {
        // Find the temp user by email and delete it
        const deletedUser = await User.findOneAndDelete({ email: userEmail });

        if (!deletedUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

router.get('/user-accounts', async (req, res) => {
    try {
        // Fetch all user accounts from the database
        const users = await User.find();

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching user accounts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// router.get('/approve-tempacc/:email', async (req, res) => {
//     const userEmail = req.params.email;

//     try {
//         // Find the temp user by email
//         const tempUser = await TempUser.findOne({ email: userEmail });

//         if (!tempUser) {
//             return res.status(404).send({ message: 'Temp user not found' });
//         }

//         // Create a new user instance using data from the temp user
//         const newUser = new User({
//             company: tempUser.company,
//             contact: tempUser.contact,
//             email: tempUser.email,
//             password: tempUser.password, // You might want to hash the password again if needed
//             userRole: tempUser.userRole
//         });

//         // Save the new user to the user account collection
//         await newUser.save();

//         // Delete the temp user from the temp user collection
//         await TempUser.findOneAndDelete({ email: userEmail });

//         res.status(200).send({ message: 'User approved and moved to user account collection successfully' });
//     } catch (error) {
//         console.error('Error approving temp user:', error);
//         res.status(500).send({ message: 'Internal server error' });
//     }
// });

// Route for approving users by email
router.post('/approve-user/:email', async (req, res) => {
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
});

// // Function to send approval email
// async function sendApprovalEmail(userEmail) {
//     try {
//         const transporter = nodemailer.createTransport({
//             host: 'smtp.gmail.com',
//             port: 465,
//             secure: true,
//             auth: {
//                 user: 'greenjobs2024@gmail.com', // Your email address
//                 pass: 'Green@123', // Your email password or app-specific password
//             },
//         });

//         await transporter.sendMail({
//             from:'greenjobs2024@gmail.com',
//             to: userEmail,
//             subject: 'Account Approved',
//             text: 'Your account has been approved. You can now log in and access our services.',
//         });
//     } catch (error) {
//         console.error('Error sending approval email:', error);
//         throw error; // Rethrow the error to be caught by the caller
//     }
// }

router.get('/approve-tempacc/:email', async (req, res) => {
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
});

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
            text: 'your Email account has been approved . You can now log in and access our services.',
        });
    } catch (error) {
        console.error('Error sending approval email:', error);
        throw error;
    }
}

module.exports = router;