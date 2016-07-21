'use strict';

let express = require('express'),
    //jwt = require('jsonwebtoken'),
    UserRouter = express.Router();

import {User} from '../model/user';

//import {JWTs_SECRET} from '../setting';

import {signJwt} from '../service/auth';

UserRouter.get('/login', (req, res, next) => {
  res.send('valar morghulis');
});

UserRouter.put('/login', (req, res, next) => {
  let usernameOrEmail = req.body.usernameOrEmail,
      password = req.body.password;

  if( !usernameOrEmail && !password ){
    return res.status(400).send();
  }

  let queryInfo;
  if( usernameOrEmail.indexOf('@') > 0 ){
    queryInfo = {
      email: usernameOrEmail,
      password: password
    }
  } else {
    queryInfo = {
      username: usernameOrEmail,
      password: password
    }
  }
  
  User.authUser(queryInfo).then(user => {
    if( !user ){
      return res.status(401).send();
    }
    return res.send({
      id_token: '',
      user: user
    });
  }).catch(error => {
    res.status(500).send();
    throw error;
  });
});

UserRouter.post('/sign-up', (req, res, next) => {
  let {username, password} = req.body;
  User.createUser({
    username,
    password
  }).then((user) => {
    user.save().then((user) => {
      let json = user.omit('password');
      const token = signJwt({user: json});
      
      res.header('jwts-token', token);
      res.status(201).send(json);
    });
  }).catch(error => {
    res.status(500).send();
    throw error;
  });
});



export {UserRouter};
