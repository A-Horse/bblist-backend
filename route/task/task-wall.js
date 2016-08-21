'use strict';

let express = require('express'),
    jwt = require('express-jwt'),
    TaskWallRouter = express.Router();

import {authJwt} from '../middle/jwt';
import {AccessLimitError, NotFoundError} from '../../service/error';
import {TaskWall, TASKWALL_TYPE} from '../../model/task-wall';
import {TaskCard} from '../../model/task-card';
import {TaskList} from '../../model/task-list';
import {Group} from '../../model/group';

TaskWallRouter.use(authJwt);

TaskWallRouter.get('/task-wall', (req, res, next) => {
  let {jw} = req;
  TaskWall.getModel().where({
    ownerId: jw.user.id
  }).fetchAll().then(data => {
    res.send(data);
  });
});

TaskWallRouter.delete('/task-wall/:id', (req, res, next) => {
  const {id} = req.params;
  TaskWall.getTaskWall({id})
    .destroy()
    .then(result => {
      res.status(200).send();
    }, err => {
      // TODO:
      throw err;
    });
});

TaskWallRouter.get('/task-wall/:id/all', (req, res, next) => {
  const {id} = req.params;
  const {jw} = req;

  TaskWall.getModel().where({id}).fetch()
    .then(taskWall => {
      if( !taskWall ) throw new NotFoundError('task wall not found')
      
      // TODO check is public
      Group.getModel().where({
        taskWallId: taskWall.id,
        userId: jw.user.id
      }).fetch().then(function(access){
        if( !access ) throw new AccessLimitError('can access this task wall');        
        return Promise.all([
          TaskCard.getModel().where({
            taskWallId: taskWall.id
          }).fetchAll(),
          TaskList.getModel().where({
            taskWallId: taskWall.id
          }).fetchAll()
        ]).then(values => {
          let [cards, categorys] = values;
          return res.send({
            info: taskWall,
            cards: cards,
            category: categorys
          });
        }).catch(error => {throw error});
      });
    });
});


TaskWallRouter.post('/task-wall', (req, res, next) => {
  let {name, isPublic} = req.body;
  let {jw} = req;
  
  new TaskWall({
    name,
    ownerId: jw.user.id,
    isPublic: isPublic || false,
    type: TASKWALL_TYPE.NORMAL
  }).bundleCreate().then(taskWall => {
    res.status(201).send(taskWall);
  }).catch(error => {throw error});
});

export {TaskWallRouter};
