import gql from 'graphql-tag'

export const USER_QUERY = gql`
    query {
        getUser{
            id
            username
            teams {
                id
                name
                admin
                channels{
                    id
                    name
                }
            } 
        }
    }
`