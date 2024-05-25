const User = require('../models/userModel/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TempUser = require('../models/userModel/tempuser');


const deletetemp_acc =async (req, res) => {
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
};



module.exports = {
  deletetemp_acc
};
