const { gql } = require('apollo-server-express');


export default gql`
  type Team {
    owner: User!
    members: [User!]!
    channels: [Channel!]!

  }
  type Channel {
    id: Int!
    name: String!
    public: Boolean!
    messages: [Message!]!
  }
  type Message {
    id: Int!
    text: String!
    user: User!
    channel: Channel!
  }
  type User {
    id: Int!
    username: String!
    email: String!
    password: String
    teams: [Team!]!
  }
  type Query {
    hello: String
  }
`;