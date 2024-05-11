

const addPost =require('../models/advertiesmentModel/addvertiesmentModel');


const addPostData =  async (req, res) =>{



    try {
        const upload = new addPost({
            // add_file: req.body.image,
            job_title: req.body.jobtitle,
            job_description:req.body.jobDescription,
            ad_closing_date:req.body.add_closing_Date,
            position_summary:req.body.possitionSummary,
            requirement1:req.body.requirement1,
            requirement2:req.body.requirement2,
            country:req.body.çountry,
            city:req.body.city,
            JobCategory:req.body.Maincategory,
            jobsubcategory: req.body.SubCategory,
            User:req.body.login_id
        });

        
        const result =await upload.save();
        console.log(result)
        res.json({ message: 'data uploaded successfully!'});
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error uploading data.' });
      }
}


module.exports ={
addPostData
}