const express = require('express');
const { ApolloServer } = require('apollo-server-express');
import models from './models/index'
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors'
import addUser from './middleware/addUser'

const SECRET = "a string that you would never be able to guess"
const SECRET2 = "another string, just used for refreshing"


const types = fileLoader(path.join(__dirname, './schema'));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')))
const typeDefs = mergeTypes(types, { all: true });

const PORT = 4000;

const app = express();
app.use(cors('*'))

//add User Id to the request
app.use(addUser)

const server =  () => {
  return new ApolloServer({ typeDefs, resolvers,  playground: true, 
    context: ({ req }) => {

      // retrieve user from the request item, added in addUser
      const user = req.user

      // add the user to the context
      return { 
        models,
        user,
        SECRET,
        SECRET2
      };
    }
  });
} 

server().applyMiddleware({ app });

// { force: true } inside sync to drop db
models.sequelize.sync().then(function () {
  app.listen(PORT);
});