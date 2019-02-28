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
      console.log(connectionParams)
      const { token, refreshToken } = connectionParams
      console.log('token', token, refreshToken)
      console.log('refresh', refreshToken)


      if (token && refreshToken) {
        let user = null;
        console.log(user)

        try {
          console.log('try block')

          const decoded = jwt.verify(token, SECRET)
          user = decoded.user
          console.log('after decode')

          console.log(user)

            
        } catch (err) {
          console.log('inside catch')

          const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
          console.log('new tokens', newTokens)

          user = newTokens.user;
          console.log(user)
        }
        console.log(user)

        if(!user) {
          throw new Error('Invalid auth tokens')
        }
        // const member = await models.Member.findOne({where : { teamId: 1, userId: user.id }})
        // console.log(member)
        // if(!member) {
        //   throw new Error('Invalid auth tokens')
        // }

        return true
      }
      throw new Error ('Missing auth tokens')
    },
  },
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