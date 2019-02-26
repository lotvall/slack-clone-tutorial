export default `
    type Message {
        id: Int!
        text: String!
        user: Int!
        channel: Channel!
        createdAt: String!
    }

    type Query {
        messages(channelId: Int!) :  [Message!]!
    }

    type Mutation {
        createMessage (channelId: Int!, text: String!) : Boolean
    }
`;