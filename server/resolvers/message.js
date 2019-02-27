import { requiresAuth } from '../permission'
export default {
    
    Message: {
        user: ({ userId }, args, { models }) => {
            console.log('user being called inside messages')
            return models.User.findOne({where: { id: userId }})
        }
    },

    Query: {
        messages: requiresAuth.createResolver(async (parent, { channelId }, {models, user}) => {
            const messages = await models.Message.findAll({
                order: [['createdAt', 'ASC']],
                where: { channelId }
            }, { raw: true })
            return messages.map(message => {
                return {
                    ...message.dataValues,
                    createdAt: message.dataValues.createdAt.toString(),
                }
            })
                
        })
    },
    Mutation: {
        createMessage: async (parent, args, {models, user}) => {
            try {
                await models.Message.create({...args, userId: user.id} )
                return true

            } catch(error) {
                console.log(error)
                return false
            }
        }
    }
}