import React from 'react'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'

const ALL_USERS_QUERY = gql`
    query {
        allUsers {
            id
        username
        }
    }
`

const Home = ({data: {loading, allUsers}}) => {
    return (
        loading ? 
        null 
        :
        allUsers.map(user => {
            return <h1 key={user.id}>{user.username}</h1>
        })
    )
}

export default graphql(ALL_USERS_QUERY)(Home)