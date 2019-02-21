import bcrypt from 'bcrypt'
import _ from 'lodash'
import { tryLogin } from "../auth";

const formatErrors = (e, models) => {
    console.log('what is this', e)
    if(e instanceof models.sequelize.ValidationError) {
        return e.errors.map(x => _.pick(x, ['path', 'message']))
    }
    return [{path: 'name', message: 'something went wrong'}]
}

export default {
    Query: {
        getUser: (parent, {id}, { models }) => models.User.findOne({where: id }),
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