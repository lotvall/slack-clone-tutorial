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
                const channel = await models.Channel.create({...args, public: true});

                return {
                  ok: true,
                  channel,
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