import formatErrors from '../formatErrors'
import { requiresAuth } from '../permission'


export default {
    Mutation: {
        createChannel: requiresAuth.createResolver(async (parent, args, {models, user}) => {
            try {
                const member = await models.Member.findOne({where: { teamId: args.teamId, userId: user.id }}, { raw: true })
                if(!member.admin) {
                    return {
                        ok: false,
                        errors: [
                            {
                                path: 'name',
                                message: 'You have to be the owner of the team to create channels'
                            }
                        ]
                    }
                }
                const response = await models.sequelize.transaction(async (transaction) => {

                    const channel = await models.Channel.create(args, {transaction});
                    if(!args.public) {
                        const members = args.members.filter(m=> m !== user.id)
                        members.push(user.id)
                        const pcmembers=members.map(m => ({userId: m, channelId: channel.id}))
                        await models.PCMember.bulkCreate(pcmembers, {transaction})
                    }
                    return channel

                })
                

                return {
                  ok: true,
                  channel: response,
                };
            } catch(error) {
                console.log(error)
                return {
                    ok: false,
                    errors: formatErrors(error, models)
                }
            }
        })
    }
}