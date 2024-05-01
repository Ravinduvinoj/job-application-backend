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

module.exports ={
    login
}