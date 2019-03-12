import axios from 'axios'

describe('user resolvers', () => {
    test('allUsers', async () => {
        const response = await axios.post('http://localhost:4000/graphql', {
            query: `
                query {
                    allUsers{
                        id
                        username
                        email
                        password
                    }
                }
            `
        })
        const { data } = response
        console.log(data)
        expect(data).toMatchObject({
            "data": {
                "allUsers": []
            }
        })

    })
})