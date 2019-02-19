const express = require('express');
const { ApolloServer } = require('apollo-server-express');
import typeDefs from './schema'
import resolvers from './resolvers'

const PORT = 4000;

const app = express();

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)