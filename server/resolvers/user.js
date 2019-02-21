import { tryLogin } from "../auth";
import formatErrors from '../formatErrors'


export default {
    Query: {
        getUser: (parent, {id}, { models }) => models.User.findOne({where: id }),
        allUsers: (parent, args, { models }) => {
            return models.User.findAll()
        },

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