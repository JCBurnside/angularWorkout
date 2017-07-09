let router=require('express').Router(),
	bcrypt=require('bcryptjs'),
	jwt=require('jsonwebtoken'),
	sequelize=require('../db.js'),
	User=sequelize.import('../models/user.js');
router.post('/',(req,res)=>{
	User.findOne({where:{username:req.body.user.username}}).then((user)=>{
		if(user){
			bcrypt.compare(req.body.user.password,user.passwordhash,(err,matches)=>{
				if(matches){
					console.log("SESSION")
					let token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:60*60*24});
					res.json({
						user:user,
						message:"successfully authenticated",
						sessionToken:token
					});
				}else res.status(500).send({error:"FAILED TO AUTHENTICATE"});
			})
		}else res.status(500).send({error:"FAILED TO AUTHENTICATE"});
	},res.json);
});
module.exports=router;