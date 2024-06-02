const User = require('../models/userModel/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TempUser = require('../models/userModel/tempuser');

const login = async (req, res) => {
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
 
        const token = jwt.sign({ _id: user._id ,userRole:user.userRole}, "secret");

        res.cookie("jwt", token, {
            httpOnly: true,
            secure:true,
            maxAge: new Date(Date.now() +24 * 60 * 60 * 1000) //for one day
        });

        res.send({
            message: "successfully",
            userRole: user.userRole, // usertype response
            token: user.token
        });
  
 

}

const getAllUserAccounts = async (req, res) => {
    try {
        // Fetch all user accounts from the database
        const users = await User.find();


        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching user accounts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const user = async (req, res) => {
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
        console.log(data)

    }
    catch (error) {
        return res.status(401).send({
            message: "unauthenticated"
        })
    }
};
const temp_registerUser = async (req, res) => {
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

        res.send({
            message: "successfully",
            
        })
    }
}

const delete_useracc = async (req, res) => {
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
const update_user = async (req, res) => {
    const userEmail = req.params.email;
    const { company, contact, userRole, city, address, companyurl } = req.body;

    try {
        // Find the user by email
        let user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user fields
        user.company = company || user.company;
        user.contact = contact || user.contact;
        user.userRole = userRole || user.userRole;
        user.city = city || user.city;
        user.address = address || user.address;
        user.companyurl = companyurl || user.companyurl;

        // Save the updated user
        user = await user.save();

        res.status(200).json({
            message: 'User updated successfully',
            user: user
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getTempUser = async (req, res) => {
    try {
        const tempUsers = await TempUser.find({});

        res.send(tempUsers);
    } catch (error) {

        res.status(500).send({
            message: 'Error retrieving temp users',
            error: error.message
        });
    }
};

const logout = (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 })
    res.send({
        message: "successfully",
    })
}

module.exports = {
    login,
    getAllUserAccounts,
    user,
    temp_registerUser,
    delete_useracc,
    update_user,
    getTempUser,
    logout
}