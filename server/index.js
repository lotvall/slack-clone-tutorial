const express = require('express');
const { ApolloServer } = require('apollo-server-express');
import models from './models/index'
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
const types = fileLoader(path.join(__dirname, './schema'));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')))
const typeDefs = mergeTypes(types, { all: true });

const PORT = 4000;

const app = express();

const server = new ApolloServer({ typeDefs, resolvers, 
  context: {
    models,
    user: {
      id: 1
    }
  }
});

server.applyMiddleware({ app });

models.sequelize.sync().then(function () {
  app.listen(PORT);
});