const express = require('express');
const { ApolloServer } = require('apollo-server-express');
import typeDefs from './schema'
import resolvers from './resolvers'
import models from './models/index'

const PORT = 4000;

const app = express();

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

models.sequelize.sync().then(function () {
  app.listen(PORT);
});