const User = require('../models/userModel/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

 const login =async (req, res) => {
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
}

const getAllUserAccounts =  async (req, res) => {
    try {
        // Fetch all user accounts from the database
        const users = await User.find();

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching user accounts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const user =async (req, res) => {
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
};
const temp_registerUser =async (req, res) => {
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
}
const delete_useracc =async (req, res) => {
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
};



module.exports ={
    login,
    getAllUserAccounts,
    user,
    temp_registerUser,
    delete_useracc
}