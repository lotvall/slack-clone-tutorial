import formatErrors from '../formatErrors'
import { requiresAuth } from '../permission'


export default {
    Mutation: {
        createDMChannel: requiresAuth.createResolver(async (parent, { teamId, members }, {models, user}) => {
            
            
            const member = await models.Member.findOne({
                where: {
                    teamId,
                    userId: user.id
                }
            }, {raw: true})

            if(!member) {
                throw new Error ("Not Authorized")
            }
            
            const allMembers = [...members, user.id]

            // check if DMchannel already exists with these members
            const [data, result] = await models.sequelize.query(`
                select c.id, c.name
                from channels as c, pcmembers pc
                where pc.channel_id = c.id and c.dm=true and c.public=false and c.team_id= ${teamId}
                group by c.id, c.name
                having array_agg(pc.user_id) @> Array[${allMembers.join(',')}] and count(pc.user_id)=${allMembers.length};
            `, {raw: true})

            if (data.length) {
                return {
                    id: data[0].id,
                    name: data[0].name
                }
            }

            const users = await models.User.findAll({
                raw: true,
                where: {
                    id: {
                        [models.sequelize.Op.in]: members
                    }
                }
            })

            const name = users
                .map(u => u.username)
                .join(', ')

            const channelId = await models.sequelize.transaction(async (transaction) => {

                const channel = await models.Channel.create({
                    name,
                    public: false,
                    dm: true,
                    teamId, 
                }, {transaction})
                const cId = channel.id
                const pcmembers=allMembers.map(m => ({userId: m, channelId: cId}))
                await models.PCMember.bulkCreate(pcmembers, {transaction})
                console.log(channel, pcmembers)
                return cId

            })
            return {
                id: channelId,
                name
            }
        }),
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