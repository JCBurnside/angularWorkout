module.exports=(sequelize,DataTypes)=>{
	return sequelize.define('definition',{
		description:DataTypes.STRING,
		logType:DataTypes.STRING,
		owner:DataTypes.INTEGER
	},{});
}