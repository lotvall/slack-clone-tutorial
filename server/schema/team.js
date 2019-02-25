const { gql } = require('apollo-server-express');

export default `
    type Team {
        id: Int!
        name: String!
        owner: User!
        members: [User!]!
        channels: [Channel!]!
    }

    type CreateTeamResponse {
        ok: Boolean!
        team: Team!
        errors: [Error!]
    }

    type Query {
        allTeams: [Team!]!
    }

    type Mutation {
        createTeam (name:String!) : CreateTeamResponse!
    }
`;