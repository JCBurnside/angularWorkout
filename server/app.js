require('dotenv').config()
var express=require('express'),
	app=express(),
	bodyParser=require('body-parser'),
	// sequelize=require('./db.js'),
	mongoose=require('mongoose'),
	mongo=require('./db_mongo.js'),
	account=require('./models/mongoUser.js')(mongoose);
mongoose.connect(mongo.databaseUrl);
mongoose.connection.on('connected',()=>{
	console.log("CONNECTED TO MONGO SERVER");
})


// var User=sequelize.import('./models/user');
// sequelize.sync();
// User.sync({force:true}); //Used to force drop a table
app.use(bodyParser.json());
app.get('/api/test',(req,res)=>res.send("HELLO"))
// app.post('/api/user',(req,res)=>{
// 	var username=req.body.user.username,
// 		password=req.body.user.password;
// 	console.log("CREATING USER")
// 	account.register(username,password,res);
// 	// res.status(200).send("CREATED");
// })
app.use(require('./middleware/headers'));
app.use(require('./middleware/validate_session'));
app.use('/api/user',require('./routes/user.js')(account));
app.use('/api/login',require('./routes/session.js'));
app.use('/api/definition',require('./routes/definition.js'));
app.use('/api/log',require('./routes/log.js'));
app.listen(3000,()=>{//listen to port 3000 http requests
	console.log("APP IS OPENING PORT 3000")
});