export default `

    type DirectMessage {
        id: Int!
        text: String!   
        sender: User!
        receiverId: Int!
    }

    type Query {
        directMessages(receiverId: Int!) :  [Message!]!
    }

    type Mutation {
        createDirectMessage (receiverId: Int!, text: String!) : Boolean
    }
`;