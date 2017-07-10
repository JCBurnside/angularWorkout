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
	}).then(data=>res.json(data),err=>res.status(500).send(err.message));	
});
router.get('/',(req,res)=>{
	Log.findAll({where:{owner:req.user.id}})
	.then(data=>res.json(data),err=>res.status(500).send(err.message))
});
router.get('/:id',(req,res)=>{
	var data=req.params.id;
	Log.findOne({where:{id:data}}).then(data=>res.json(data),err=>{
		console.log(err);
		res.status(500).send(err.message);
	});
});
router.put('/',(req,res)=>{
	var desc=req.body.log.desc,
		result=req.body.log.result,
		data=req.body.log.id,
		def=req.body.log.def;
	log.update({
		description:desc,
		result:result,
		def:def
	},{where:{id:data}}).then(data=>res.json(data),err=>{
		console.log(err);
		res.status(500).send(err.message);
	})
})
router.delete('/',(req,res)=>{
	var data=req.body.log.id;
	Log.destroy({where:{id:data}}).then(_=>res.send("You removed a log"),err=>{
		console.log(err);
		res.status(500,err.message);
	});
})
module.exports=router;