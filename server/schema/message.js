export default `
    type Message {
        id: Int!
        text: String!
    }

    type Mutation {
        createMessage (channelId: Int!, text: String!) : Boolean
    }
`;