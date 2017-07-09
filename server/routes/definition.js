var router=require('express').Router(),
	sequilize=require('../db'),
	User=sequilize.import('../models/user'),
	Definition=sequilize.import('../models/definition');
router.post('/',(req,res)=>{
	var desc=req.body.definition.desc,
		logType=req.body.definition.type,
		owner=req.user.id;
	Definition.create({
		description:desc,
		logType:logType,
		owner:owner		
	}).then(data=>{
		res.json({
			definition:data
		})
	},err=>res.status(500).send(err.message));
});
router.get('/',(req,res)=>{
	console.log("IN GET");
	var id=req.user.id;
	Definition
	.findAll({where:{owner:id}})
	.then(data=>res.json(data),err=>res.status(500).send(err.message));
	console.log("OUT OF GET");
})
module.exports=router;