import formatErrors from '../formatErrors'
import { requiresAuth } from '../permission'

export default {
    Query: {
        allTeams: requiresAuth.createResolver(async (parent, args, {models, user}) => 
                await models.Team.findAll({ owner: user.id}, { raw: true })
        )
    },
    Mutation: {
        createTeam: requiresAuth.createResolver(async (parent, args, {models, user}) => {

            try {
                await models.Team.create({...args, owner: user.id})
                return {
                    ok: true
                }
            } catch(error) {
                console.log(error)
                return {
                    ok: false,
                    errors: formatErrors(error, models)
                }
            }
        }),
    },
    Team: {
        channels:({ id }, args, { models }) => models.Channel.findAll({ teamId: id })
    }
}