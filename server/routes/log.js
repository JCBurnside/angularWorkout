var router=require('express').Router(),
	sequilize=require('../db.js'),
	Log=sequilize.import('../models/log'),
	User=sequilize.import('../models/user'),
	Definition=sequilize.import('../models/definition');
router.post('/',(req,res)=>{
	Log.create({
		description:req.body.log.desc,
		result:req.body.log.result,
		owner:req.user.id,
		def:req.body.log.def
	}).then(log=>res.json(log),err=>res.status(500).send(err.message));	
});
router.get('/',(req,res)=>{
	Log.findAll({where:{owner:req.user.id}})
	.then(data=>res.json(data),err=>res.status(500).send(err.message))
})
module.exports=router;