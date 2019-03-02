import { requiresTeamAccess, requiresAuth } from '../permission'

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE"

export default {
    
    DirectMessage: {
        sender: ({ user, userId, senderId }, args, { models }) => {
            if(user) return user
            return models.User.findOne({where: { id: senderId }})
        }
    },

    Query: {
        directMessages: requiresAuth.createResolver(async (parent, { teamId, otherUserId }, {models, user}) => {
            const messages = await models.DirectMessage.findAll({
                order: [['createdAt', 'ASC']],
                where: { 
                    teamId, 
                    [models.sequelize.Op.or]: [{
                        [models.sequelize.Op.and]: [{senderId: user.id}, { receiverId: otherUserId}]
                    }, {
                        [models.sequelize.Op.and]: [{senderId: otherUserId}, {receiverId: user.id}]
                    }]
                }
            }, { raw: true })
            return messages.map(message => {
                return {
                    ...message.dataValues,
                    createdAt: '' + message.dataValues.createdAt,
                }
            })
                
        })
    },
    Mutation: {
        createDirectMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                // this is what is failing
                console.log('failing here...', args, user)

                const directMessage = await models.DirectMessage.create({
                    ...args,
                    senderId: user.id
                });

                console.log('this is allowed to run, ', directMessage)
        
                // const asyncFunc = async () => {
                //   const currentUser = await models.User.findOne({
                //     where: {
                //       id: user.id,
                //     },
                // });
        
                // pubsub.publish(NEW_CHANNEL_MESSAGE, {
                //     channelId: args.channelId,
                //     newChannelMessage: {
                //       ...message.dataValues,
                //       user: currentUser.dataValues,
                //       createdAt: '' + message.dataValues.createdAt,
                //     },
                //   });
                // };
        
                // asyncFunc();

                return true;
            } catch (err) {
                console.log(err);
                return false;
            }
        }),
    },
}