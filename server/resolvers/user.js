import { tryLogin } from "../auth";
import formatErrors from '../formatErrors'
import { requiresAuth } from '../permission'


export default {
    Team: {
        admin: async (parent, args, {models, user }) => {
            console.log('problem med admin field tag2', parent)

            const teamId = parent.id
            const userId = user.id
            const member = await models.Member.findOne({
                where: { team_id: teamId, user_id: userId}
            })
            const admin = member.dataValues.admin
            return admin
        }
    },
    User: {
        teams: (parent, args, { models, user }) =>{
            console.log('problem med admin field tag1', user)
            // problem med admin har
            return models.sequelize.query(
                'select * from teams as team join members as member on team.id = member.team_id where member.user_id = ?',
                {
                replacements: [user.id],
                model: models.Team,
                raw: true,
                },
            )
        },
    },
    Query: {
        getUser: requiresAuth.createResolver((parent,args, { models, user }) => models.User.findOne({where: { id: user.id  } })),
        singleUser: (parent, { userId }, { models }) => models.User.findOne({
            where: { id: userId }
        }),
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