export default (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        username: {
            type:DataTypes.STRING,
            unique: true,
            validate: {
                isAlphanumeric: {
                    message: "The username can only contain letters and numbers"
                }, 
                len: {
                    args: [5, 12],
                    message: "The username needs to be between 5 and 12 characters long"
                },
            }
        },
        email: {
            type:DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: {
                    message: "Invalid email"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            
        },
    });
  
    User.associate = (models) => {
        User.belongsToMany(models.Team, {
            through: 'member',
            foreignKey: 'userId',
        })
        User.belongsToMany(models.Channel, {
            through: 'channel_member',
            foreignKey: 'userId',
        })
    }
  
    return User;
};