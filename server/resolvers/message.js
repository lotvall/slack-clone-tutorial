import { requiresTeamAccess, requiresAuth } from '../permission'
import { withFilter } from 'apollo-server'
import pubsub from '../pubsub'

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE"

export default {
    
    Message: {
        user: ({ user, userId }, args, { models }) => {
            console.log('user being called inside messages')
            if(user) return user
            return models.User.findOne({where: { id: userId }})
        }
    },

    Subscription: {
        newChannelMessage: {
            subscribe: requiresTeamAccess.createResolver(withFilter((parent, { channelId } , { models, user }) => {
                console.log('do we have user here?', user)
                return pubsub.asyncIterator(NEW_CHANNEL_MESSAGE)            
            },
            (payload, args, { user }) => {
                console.log('payload MS', payload)
                console.log('args MS', args)
                console.log('user MS', user)

                return payload.channelId === args.channelId ;
            }))
        }

    },

    Query: {
        messages: requiresAuth.createResolver(async (parent, { channelId }, {models, user}) => {
            console.log('query msg', user)
            const messages = await models.Message.findAll({
                order: [['created_at', 'ASC']],
                where: { channelId }
            }, { raw: true })
            return messages.map(message => {
                return {
                    ...message.dataValues,
                    created_at: '' + message.dataValues.created_at,
                }
            })
                
        })
    },
    Mutation: {
        createMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
          try {
            // this is what is failing
            console.log('failing here...')
            const message = await models.Message.create({
                ...args,
                userId: user.id,
            });

            console.log('this is allowed to run')
    
            const asyncFunc = async () => {
              const currentUser = await models.User.findOne({
                where: {
                  id: user.id,
                },
              });
    
              pubsub.publish(NEW_CHANNEL_MESSAGE, {
                channelId: args.channelId,
                newChannelMessage: {
                  ...message.dataValues,
                  user: currentUser.dataValues,
                  created_at: '' + message.dataValues.created_at,
                },
              });
            };
    
            asyncFunc();

                return true;
            } catch (err) {
                console.log(err);
                return false;
            }
        }),
    },
}