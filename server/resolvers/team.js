import formatErrors from '../formatErrors'
import { requiresAuth, requiresTeamAccess } from '../permission'

export default {
    Query: {
        getTeamMembers: requiresAuth.createResolver(async (parent, { teamId }, { models, user }) => {
                return await models.User.findAll({
                    include: [{
                        model: models.Team,
                        where: { id: teamId },
                    }]   
                }, { raw: true })
        })
    },
    Mutation: {
        createTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
            try {
                const response = await models.sequelize.transaction(async (transaction) => {
                    const team = await models.Team.create({ ...args }, { transaction });
                    await models.Channel.create({ name: 'general', public: true, teamId: team.id }, { transaction });
                    await models.Member.create({ teamId: team.id, userId: user.id, admin: true, }, { transaction });

                    return team;
                });

                return {
                    ok: true,
                    team: response,
                };
            } catch (err) {
                console.log(err);
                return {
                    ok: false,
                    errors: formatErrors(err, models),
                };
            }
        }),

        addTeamMember: requiresAuth.createResolver(async (parent, { email, teamId }, {models, user}) => {
            
            try {
                const memberPromise = models.Member.findOne({ where: { teamId, userId: user.id }}, { raw: true })
                const userToAddPromise = models.User.findOne({ where: { email }}, { raw: true })

                const [member, userToAdd] = await Promise.all([memberPromise, userToAddPromise])
                if (!member.admin) {
                    return {
                        ok: false,
                        errors:[{path: 'email', message: 'You cannot add members to the team'}] 
                    }
                }

                if(!userToAdd){
                    return{
                        ok: false,
                        errors:[{path: 'email', message: 'Could not find user with this email'}] 
                    }
                }
                await models.Member.create({ userId: userToAdd.id, teamId})
                return {
                    ok: true
                } 
                
            } catch(error) {
                return {
                    ok: false,
                    errors: formatErrors(error, models)
                }
            }
        }),
    },
    Team: {
        channels:({ id }, args, { models }) => models.Channel.findAll({where: { teamId: id }}),
        directMessageMembers: ({ id }, args, { models, user }) =>
            models.sequelize.query(
                'select distinct on (u.id) u.id, u.username from users as u join direct_messages as dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id) where (:currentUserId = dm.sender_id or :currentUserId = dm.receiver_id) and dm.team_id = :teamId',
                {
                replacements: { currentUserId: user.id, teamId: id },
                model: models.User,
                raw: true,
                },
            ),
        // directMessageMembers:async ({ id }, { teamId }, { models, user }) => {
        //     console.log('directMessageMembers being called')
        //     const response = await models.User.findAll({ 
        //         include:[{
        //             model: models.DirectMessage,
        //             where: {                        
        //                 teamId, 
        //                 [models.sequelize.Op.or]: [{senderId: user.id}, {receiverId: user.id}]
        //             }
        //         }]
        //         }, { raw: true })
                
        //     console.log('', response)
        //}
    }
}