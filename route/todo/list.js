import express from 'express';
import {authJwt} from '../middle/jwt';
import {TodoModel} from '../../model/todo';
import {TodoBoxModel} from '../../model/todo-box';
import {TodoBoxAccessModel} from '../../model/todo-box-access';
import {AccessLimitError, NotFoundError} from '../../service/error';
import {validateRequest} from '../../service/validate';
import R from 'fw-ramda';

const TodoListRouter = express.Router();

TodoListRouter.use(authJwt);

TodoListRouter.get('/user/:userId/todo', (req, res, next) => {
  const {jw} = req;
  const {userId} = req.params;
  if (jw.user.id !== +userId) {
    throw new AccessLimitError();
  }
  new TodoModel({userId: jw.user.id})
    .fetchAll().then(todos => res.send(todos))
    .catch(next);
});

TodoListRouter.post('/user/:userId/todo', (req, res, next) => {
  validateRequest(req.body, 'content', ['required']);
  // TODO auth
  const {jw} = req;
  new TodoModel({
    userId: jw.user.id,
    content: req.body.content,
    deadline: req.body.deadline
  }).save().then(todo => {
    res.send(todo);
  }).catch(next);
});

TodoListRouter.post('/todos', async (req, res, next) => {
  const {jw} = req;
  try {
    const todoBox = await new TodoBoxModel({creator: jw.user.id, name: req.body.name}).save();
    res.status(201).json(todoBox);
  } catch(error) {
    next(error);
  }
});

TodoListRouter.get('/user/:userId/todo-box', async (req, res, next) => {
  const {jw} = req;
  // const access = await new TodoBoxAccessModel({userId: req.params.userId}).fetchAll();
  const userBox = {name: 'My Todo', id: null, type: 'private'};
  res.json([userBox]);
});

TodoListRouter.delete('/todo/:todoId', (req, res) => {
  const {todoId} = req.params;
  const {jw} = req;
  new TodoModel({
    id: todoId
  }).fetch().then(goal => {
    goal.destroy().then(function(){
      res.status(202).send();
    });
  });
});

TodoListRouter.patch('/todo/:todoId', (req, res, next) => {
  // TODO auth
  new TodoModel({
    id: req.params.todoId
  }).fetch().then(function(todo) {
    todo.save(req.body).then(todo => {
      res.send(todo);
    });
  }).catch(next);
});

TodoListRouter.patch('/user/:userId/todo/:todoId', (req, res, next) => {
  // TODO auth
  new TodoModel({
    id: req.params.todoId
  }).fetch().then(function(todo) {
    todo.save(req.body).then(todo => {
      res.send(todo);
    });
  }).catch(next);
});

export {TodoListRouter};
