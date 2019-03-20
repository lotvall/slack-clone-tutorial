const { gql } = require('apollo-server-express');

export default `
    type Channel {
        id: Int!
        name: String!
        public: Boolean!
        dm: Boolean!
        messages: [Message!]!
        members: [User!]
    }

    type ChannelResponse{
        ok: Boolean!
        channel: Channel
        error: [Error!]
    }
    type DMChannelResponse {
        id: Int!,
        name: String!
    }
    type Mutation {
        createChannel (teamId: Int! , name:String!, public: Boolean=false, members: [Int!]) : ChannelResponse!
        createDMChannel (teamId: Int!, members: [Int!]!) : DMChannelResponse!
    }

`;