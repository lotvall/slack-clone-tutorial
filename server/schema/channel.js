const { gql } = require('apollo-server-express');

export default `
    type Channel {
        id: Int!
        name: String!
        public: Boolean!
        messages: [Message!]!
    }

    type ChannelResponse{
        ok: Boolean!
        channel: Channel
        error: [Error!]
    }

    type Mutation {
        createChannel (teamId: Int! , name:String!, public: Boolean=false, members: [Int!]) : ChannelResponse!
    }

`;