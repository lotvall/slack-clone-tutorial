const { gql } = require('apollo-server-express');


export default `

    type User {
        id: Int!
        username: String!
        email: String!
        password: String
        teams: [Team!]!
    }

    type Query {
        getUser(id: Int!): User!
        allUsers: [User!]!
    }

    type RegisterResponse {
        ok: Boolean!
        user: User
        errors: [Error!]
    }

    type Mutation {
        registerUser(username: String!, email: String!, password: String!): RegisterResponse!
    }
`