var router=require('express').Router(),
	sequelize=require('../db.js'),
	User=sequelize.import('../models/user'),
	bcrypt=require('bcryptjs'),
	jwt=require('jsonwebtoken');
router.post('/',(req,res)=>{
	for(attr in req.body)console.log(attr)
	var username=req.body.user.username,
		pass=req.body.user.password;
	User.create({
		username:username,
		passwordhash:bcrypt.hashSync(pass,10)
	}).then((user)=>{
		console.log("POST!!!");
		var token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:60*60*24});
		res.json({
			user:user,
			message:'create',
			sessionToken:token
		});
		
	},(err)=>{
		console.log(err)
		res.send(500,err.message);
	})
});
module.exports=router;