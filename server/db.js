var Sequelize=require('sequelize'),
	sequelize=new Sequelize('workoutlog','postgres','nienpass1234',{
		host:'localhost',
		dialect:'postgres'
	});
sequelize.authenticate().then(
	function(){
		console.log('connected to DB')
	},console.log
);
var User=sequelize.import('./models/user');
var Definition=sequelize.import('./models/definition');
module.exports=sequelize;