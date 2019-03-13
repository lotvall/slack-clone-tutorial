import bcrypt from 'bcrypt'

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
                    msg: "The username needs to be between 5 and 12 characters long"
                },
            }
        },
        email: {
            type:DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: {
                    msg: "Invalid email"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [8, 20],
                    msg: "The password needs to be between 8 and 20 characters long"
                },
            }
        },
    }, {
        hooks: {
            afterValidate: async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 12)  
                user.password = hashedPassword 
            }
        }
    });
  
    User.associate = (models) => {
        User.belongsToMany(models.Team, {
          through: models.Member,
          foreignKey: {
            name: 'userId',
            field: 'user_id',
          },
        });
        // N:M
        User.belongsToMany(models.Channel, {
          through: 'channel_member',
          foreignKey: {
            name: 'userId',
            field: 'user_id',
          },
        });
        User.belongsToMany(models.Channel, {
            through: models.PCMember,
            foreignKey: {
              name: 'userId',
              field: 'user_id',
            },
          });
      };
    
      return User;
    };