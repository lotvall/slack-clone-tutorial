const express = require('express');
const { ApolloServer } = require('apollo-server-express');
import models from './models/index'
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors'
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


//middleware that adds user to the request
const addUser = async (req, res, next) => {
  console.log('middleware is being user')
  const token = req.headers['x-token'];
  console.log('token', token)

  if (token) {
    try {
      console.log('if succeeded', token)
      console.log('secret', SECRET)
      jwt.verify(token, SECRET, function(err, decoded) {
        if(err){
            console.log(err)
        }else{
            console.log('else statement', decoded.user)
            req.user = decoded.user
            console.log('req.user', req.user)

        }
       })

    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

app.use(addUser)



const server =  () => {
  return new ApolloServer({ typeDefs, resolvers, 
    context: ({ req }) => {
      // get the user token from the headers
      const token = req.headers['x-token'] || '';

      console.log('is token still here', token)

      console.log('we can access request user', req.user)

      // try to retrieve a user with the token
      const user = req.user
      console.log(user)
      // const user = addUser(token)

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

models.sequelize.sync().then(function () {
  app.listen(PORT);
});