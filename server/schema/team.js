const { gql } = require('apollo-server-express');

export default `
    type Team {
        id: Int!
        name: String!
        directMessageMembers: [User!]!
        channels: [Channel!]!
        admin: Boolean!
    }

    type CreateTeamResponse {
        ok: Boolean!
        team: Team
        errors: [Error!]
    }

    type Query {
        allTeams: [Team!]!
        invitedTeams: [Team!]!
        getTeamMembers(teamId: Int!): [User!]!
    }

    type VoidResponse {
        ok: Boolean!
        errors: [Error!]
    }

    type Mutation {
        createTeam (name:String!) : CreateTeamResponse!
        addTeamMember (email: String!, teamId: Int!) : VoidResponse!
    }
`;