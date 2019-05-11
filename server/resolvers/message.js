import { requiresTeamAccess, requiresAuth } from '../permission'
import { withFilter } from 'apollo-server'
import pubsub from '../pubsub'
import storeFS from '../storeFS'

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE"

export default {
    
    Message: {
        url: parent => {
            return parent.url ? `http://localhost:4000/uploads/${parent.url}` : parent.url
        },
        user: ({ user, userId }, args, { models }) => {
            if(user) return user
            return models.User.findOne({where: { id: userId }})
        }
    },

    Subscription: {
        newChannelMessage: {
            subscribe: requiresTeamAccess.createResolver(withFilter((parent, args , { models, user }) => {
                return pubsub.asyncIterator(NEW_CHANNEL_MESSAGE)            
            },
            (payload, args, { user }) => {

                return payload.channelId === args.channelId ;
            }))
        }

    },

    Query: {
        messages: requiresAuth.createResolver(async (parent, { cursor, channelId }, {models, user}) => {
            const channel = await models.Channel.findOne({raw: true, where: {id: channelId}})

            if (!channel.public) {
                const member = await models.PCMember.findOne({raw: true, where: { channelId, userId: user.id }})
                if(!member) {
                    throw new Error ('Not Authorized')
                }
            }

            const options = {
                order: [['created_at', 'DESC']], 
                where: { channelId }, 
                limit: 35, 
            }

            // find all elements after the cursor
            if (cursor){
                options.where.created_at = {
                    [models.op.lt]: cursor,
                }
            }
            console.log('options', options, cursor)
            const messages = await models.Message.findAll(options, { raw: true })
            console.log('is this running even', messages, messages.length)
            if(messages.length === 0){
                return {
                    cursor: null,
                    messages: []
                }
            }
            return {
                cursor: '' + messages[messages.length-1].created_at,
                messages: messages.map(message => {
                    return {
                        ...message.dataValues,
                        created_at: '' + message.dataValues.created_at,
                    }
                })
            }
                
        })
    },
    Mutation: {
        createMessage: requiresAuth.createResolver(async (parent, { file , ...args }, { models, user }) => {
          try {
            const messageData = args
            if (file) {

                console.log('file??', !!file)

                const { createReadStream, filename, mimetype, encoding } = await file
                
                messageData.filetype = mimetype
                messageData.url = filename
                
                const stream = createReadStream()
                
                storeFS(stream, filename)
                
            }
            console.log('massage data', messageData)
            const message = await models.Message.create({
                ...messageData,
                userId: user.id,
            });
    
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