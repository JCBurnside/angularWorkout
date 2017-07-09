let jwt=require('jsonwebtoken'),
	sequelize=require('../db.js'),
	User=sequelize.import('../models/user.js');
	console.log("REQUESTED");
module.exports=(req,res,next)=>{
	let sessionToken=req.headers.authorization;
	if(!req.body.user&&sessionToken){
		jwt.verify(sessionToken,process.env.JWT_SECRET,(err,decoded)=>{
			if(decoded){
				User.findOne({where:{id:decoded.id}}).then(user=>{
					req.user=user;
					req.id=decoded.id;
					next();
				},()=>res.status(401).send({error:'Not authorized'}));
			}else{
				res.status(401).send({error:"invalid",message:"VERIFY HAS FAILED"});
				console.log(err)
			}
		});
	}else next();
}