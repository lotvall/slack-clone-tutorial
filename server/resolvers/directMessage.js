import { requiresAuth , directMessageSubscription} from '../permission'
import { withFilter } from 'apollo-server'
import pubsub from '../pubsub'

const NEW_DIRECT_MESSAGE = "NEW_DIRECT_MESSAGE"

export default {
    
    DirectMessage: {
        sender: ({ user, userId, senderId }, args, { models }) => {
            console.log('maybe issue here_', user, userId, senderId)
            if(user) return user
            return models.User.findOne({where: { id: senderId }})
           
        }
    },
    // Subscription: {
    //     newDirectMessage: {
    //       subscribe: directMessageSubscription.createResolver(withFilter(
    //         () => pubsub.asyncIterator(NEW_DIRECT_MESSAGE),
    //         (payload, args, { user }) =>
    //           payload.teamId === args.teamId &&
    //             ((payload.senderId === user.id && payload.receiverId === args.userId) ||
    //               (payload.senderId === args.userId && payload.receiverId === user.id)),
    //       )),
    //     },
    //   },

    Subscription: {
        newDirectMessage: {
            subscribe: directMessageSubscription.createResolver(withFilter((parent, { teamId, otherUserId }, { models, user }) => {
                    console.log('do we have user here? DMS - no user')
                    return pubsub.asyncIterator(NEW_DIRECT_MESSAGE)            
                },
                (payload, args) => {
                    console.log('payload DMS', payload)
                    console.log('args DMS', args)
                    // console.log('user DMS', user)
                    return payload.teamId === args.teamId &&
                        ((payload.receiverId === args.otherUserId) ||
                        (payload.senderId === args.otherUserId ))
                }))
        }

    },

    Query: {
        directMessages: requiresAuth.createResolver(async (parent, { teamId, otherUserId }, {models, user}) => {
            const directMessages = await models.DirectMessage.findAll({
                order: [['created_at', 'ASC']],
                where: { 
                    teamId, 
                    [models.sequelize.Op.or]: [{
                        [models.sequelize.Op.and]: [{senderId: user.id}, { receiverId: otherUserId}]
                    }, {
                        [models.sequelize.Op.and]: [{senderId: otherUserId}, {receiverId: user.id}]
                    }]
                }
            }, { raw: true })
            return directMessages.map(directMessage => {
                return {
                    ...directMessage.dataValues,
                    created_at: '' + directMessage.dataValues.created_at,
                }
            })
                
        })
    },
    Mutation: {
        createDirectMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                // this is what is failing
                console.log('what is this...', user)

                //args - teamid, receiverid, text

                const directMessage = await models.DirectMessage.create({
                    ...args,
                    senderId: user.id
                });

                console.log('this is allowed to run, ', directMessage.dataValues)
                console.log('pubsub works', pubsub)

                pubsub.publish(NEW_DIRECT_MESSAGE, {
                    teamId: args.teamId,
                    senderId: user.id,
                    receiverId: args.receiverId,
                    newDirectMessage: {
                        ...directMessage.dataValues,
                        sender: {
                            username: user.username
                        },
                        created_at: '' + directMessage.dataValues.created_at,
                    },
                });
                return true;
            } catch (err) {
                console.log(err);
                return false;
            }
        }),
    },
}