import express from 'express'
import { ApolloServer, graphqlExpress } from 'apollo-server-express'
import models from './models/index'
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors'
import addUser from './middleware/addUser'
import http from 'http'

import bodyParser from 'body-parser';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionServer } from 'subscriptions-transport-ws';

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

const server =  new ApolloServer({ typeDefs, resolvers,  playground: true, 
    context: ({ req, connection }) => {

      // retrieve user from the request item, added in addUser

      // add the user to the context
      return { 
        models,
        user: connection ? connection.context : req.user,
        SECRET,
        SECRET2
      };
    }
  });

server.applyMiddleware({ app })

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);


// { force: true } inside sync to drop db
models.sequelize.sync().then(function () {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
  })  
});