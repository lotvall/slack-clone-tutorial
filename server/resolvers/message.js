
export default {

    Query: {
        messages: async (parent, args, {models, user}) => {
            console.log('channel id', args.channelId)
            const channelId = args.channelId

            const response = await models.Message.findAll({where: { channelId }}, { raw: true })
            
            const messages = response.map(message => {
                console.log('message', message.dataValues.id, message.dataValues.text,)
                return {
                    id: message.dataValues.id,
                    text: message.dataValues.text,
                    channelId,
                    createdAt: message.dataValues.createdAt,
                    user: message.dataValues.userId
                }
            })
            return messages
        }
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