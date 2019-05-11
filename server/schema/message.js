export default `

    type Message {
        id: Int!
        text: String
        user: User!
        channel: Channel!
        created_at: String!
        url: String
        filetype: String
    }

     input File {
        type: String!
        path: String!
    }

    type Subscription {
        newChannelMessage(channelId: Int!) : Message!
    }

    type MessageResponse {
        cursor: String
        messages: [Message!]!
    }

    type Query {
        messages(cursor: String, channelId: Int!) :  MessageResponse!
    }

    type Mutation {
        createMessage (channelId: Int!, text: String, file: Upload) : Boolean!
    }
`;