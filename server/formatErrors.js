import _ from 'lodash'

export default (e, models) => {
    console.log('what is this', e)
    if(e instanceof models.sequelize.ValidationError) {
        return e.errors.map(x => _.pick(x, ['path', 'message']))
    }
    return [{path: 'name', message: 'something went wrong'}]
}