module.exports=(sequlize,DataTypes)=>{
	return sequlize.define('log',{
		desc:DataTypes.STRING,
		result:DataTypes.STRING,	
		def:DataTypes.STRING,
		owner:DataTypes.INTEGER
	},{})
}