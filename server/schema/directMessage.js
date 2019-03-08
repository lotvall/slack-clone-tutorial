export default `

    type DirectMessage {
        id: Int!
        text: String!   
        sender: User!
        receiverId: Int!
        created_at: String!
    }

    type Query {
        directMessages(teamId: Int!, otherUserId: Int!) :  [DirectMessage!]!
    }

    type Mutation {
        createDirectMessage (teamId: Int!, receiverId: Int!, text: String!) : Boolean!
    }
`;