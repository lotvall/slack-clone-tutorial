import jwt from 'jsonwebtoken'
import { refreshTokens } from '../auth'
import models from '../models/index'

const SECRET = "a string that you would never be able to guess"
const SECRET2 = "another string, just used for refreshing"

//middleware that adds user to the request
export default async (req, res, next) => {
    console.log('middleware is being user')
    const token = req.headers['x-token'];
    console.log('token', token)
  
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET)

            req.user = decoded.user
            /*
            , (err, decoded) => {
        
                if(err){
                    console.log(err)
                    console.log('something wrong here')
                    throw err
                }else{
                    req.user = decoded.user
                }
          */
            
        } catch (err) {
            console.log('is the catchblock running')

            const refreshToken = req.headers['x-refresh-token'];
            console.log('refreshtoken', refreshToken)
            const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
            console.log('newtokens', newTokens)

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