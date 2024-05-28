const application = require('../models/applicationModel/applicationModel')
const adveriesment = require('../models/advertiesmentModel/addvertiesmentModel')
const jobUsers = require('../models/userModel/jobSeekerModel')

const apply = async (req ,res)=>{
    
    const _id = req.params.ad_id;
console.log(_id)
const nm = req.params.name;
console.log(nm)
   
    let contact = req.params.contact;
    let address = req.body.address;
    let city = req.params.city;
    // let country = req.body.country;
    let gender = req.params.gender;
    let dob = req.params.dob;
    let status = 'pending';
     let jobseekerid = '6640ca8b5c5c7522955cf410';
    console.log(req.body)

    const findAd = await adveriesment.findById(_id);
    const jobUserid = await jobUsers.findOne({_id:jobseekerid})
    
   console.log(findAd)
    if(!findAd){
        return res.status(400).send({
            message: "advertiesment not found please check your advertiesments are available",
        }); 
    }
    if(!jobUserid){
        return res.status(400).send({
            message: "user not found",
        }); 
    }
     // Check if the application already exists for this jobseeker and advertisement
     const existingApplication = await application.findOne({
        advertiesment: _id,
        jobseeker: jobseekerid
    });

    if (existingApplication) {
        return res.status(400).send({
            message: "You have already applied for this advertisement.",
        });
    }

    const newApply = new application({
        name: nm,
        address: address,
        city: city,
        dob: dob,
        gender: gender,
        contact: contact,
        // country: country,
        status: status,
        advertiesment: _id,
        jobseeker: jobseekerid
    })
    const result = await newApply.save();
    console.log(result);

    res.send({
        message: "successfully",
    })

         
}

module.exports= {
    apply
}