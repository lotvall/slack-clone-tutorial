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
        getUser: User!
        singleUser(userId: Int!): User
        allUsers: [User!]!
    }

    type RegisterResponse {
        ok: Boolean!
        user: User
        errors: [Error!]
    }

    type LoginResponse {
        ok: Boolean!
        token: String
        refreshToken: String
        errors: [Error!]
    }

    type Mutation {
        registerUser(username: String!, email: String!, password: String!): RegisterResponse!
        login(email: String!, password: String!): LoginResponse!

    }
`