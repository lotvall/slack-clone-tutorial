import bcrypt from 'bcrypt'
import _ from 'lodash'

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
        registerUser: async (parent, {password, ...otherArgs}, { models }) => {

            try {

                if (password.length < 5 || password.length > 20) {
                    return {
                        ok: false,
                        errors: [{path: 'password', message: 'The password needs to be between 5 and 20 characters long'}]
                    }
                }
                const hashedPassword = await bcrypt.hash(password, 12)

                const createdUser = await models.User.create({
                    ...otherArgs,
                    password: hashedPassword
                })

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