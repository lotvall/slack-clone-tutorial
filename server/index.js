import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import models from './models/index'
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors'
import addUser from './middleware/addUser'
import http from 'http'
import jwt from 'jsonwebtoken'
import { refreshTokens } from './auth'

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

  subscriptions: {
    onConnect: async ( connectionParams, webSocket, context) => {
      const { token, refreshToken } = connectionParams

      if (token && refreshToken) {

        try {
          console.log('try block')

          const { user } = jwt.verify(token, SECRET)
          console.log('try the user', user)

          return { models, user}
            
        } catch (err) {

          const { user } = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
          console.log('catch the user', newTokens.user)
          return { models, user } 
        }
      }
      console.log('just returning models for some reason')
      return { models }
    },
  },
  context: ({ req, connection }) => {

    // If we build the context for subscriptions, return the context generated in the onConnect callback.
    // In this example `connection.context` is `{ extended: 'context' }`

    // connection ? 
    //   console.log('is the user here connection', connection.context.user) : 
    //   console.log('is the user here req', req)

    // retrieve user from the request item, added in addUser
    // add the user to the context
    return { 
      models,
      user: connection ? connection.context.user : req.user,
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