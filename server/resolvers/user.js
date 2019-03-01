import { tryLogin } from "../auth";
import formatErrors from '../formatErrors'
import { requiresAuth } from '../permission'


export default {
    Team: {
        admin: async (parent, args, {models, user }) => {
            const teamId = parent.dataValues.id
            const userId = user.id
            const member = await models.Member.findOne({
                where: { teamId, userId}
            })
            const admin = member.dataValues.admin
            return admin
        }
    },
    User: {
        teams: async (parent, args, { models, user }) => 
            await models.Team.findAll({
                include: [{
                    model: models.User,
                    where: { id: user.id },
                }]   
            }, { raw: true })
    },
    Query: {
        getUser: requiresAuth.createResolver((parent,args, { models, user }) => models.User.findOne({where: { id: user.id  } })),
        allUsers: (parent, args, { models }) => models.User.findAll(),
    },
    Mutation: {
        login: (parent, {email, password}, { models, SECRET, SECRET2 }) => 
            tryLogin(email, password, models, SECRET, SECRET2),

        registerUser: async (parent, args, { models }) => {

            try {
                const createdUser = await models.User.create(args)

                return {
                    ok: true,
                    user: {
                        ...createdUser,
                        password: null
                    }
                }

            } catch(error) {
                console.log(error)
                return {
                    ok: false,
                    errors: formatErrors(error, models )
                }
            }
        }
    }
}