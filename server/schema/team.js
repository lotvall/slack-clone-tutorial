const { gql } = require('apollo-server-express');

export default `
    type Team {
        owner: User!
        members: [User!]!
        channels: [Channel!]!
    }

    type CreateTeamResponse {
        ok: Boolean!
        errors: [Error!]
    }

    type Mutation {
        createTeam (name:String!) : CreateTeamResponse!
    }
`;