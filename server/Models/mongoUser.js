var bcrypt = require('bcryptjs'),
    jwt=require('jsonwebtoken'),
    res;
module.exports = function(mongoose){
  var UserSchema = new mongoose.Schema({
    username: {type: String},
    password: {type: String}
  });

  var User = mongoose.model('User', UserSchema);

  var registerCallback = function(err,user) {
      console.log(err?err:'Account was created');
      if(!err){
        console.log("RETURNING SESSION TOKEN");
        var token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:60*60*24});
        res.json({
          user:user,
          message:'create',
          sessionToken:token
        });
      }
    };

  var register = function(username, password,_res) {
    res=_res;
    var user = new User({
      username: username,
      password: bcrypt.hashSync(password, 10)
    });
    console.log(User,user)
    user.save(registerCallback);
    console.log('Save command was sent');
  }

  return {
    User: User,
    register: register
  }
}
