import * as express from 'express';
import { authJwt } from '../../route/middle/jwt';
import { TodoModel } from '../../model/todo.model';
import { AccessLimitError } from '../../service/error';
import { validateRequest } from '../../service/validate';
import { TaskCardModel } from '../../model/task-card';
import { todoService } from '../../service/todo.service';

const TodoRouter = express.Router();

TodoRouter.get('/user/:userId/todo', authJwt, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { jw } = req;
  const { userId } = req.params;
  if (jw.user.id !== +userId) {
    throw new AccessLimitError();
  }

  try {
    const todos = await todoService.getUserDefaultTodos({
      offset: 0,
      limit: 100,
      userId
    });
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
});

TodoRouter.get('/user/:userId/todo-task', authJwt, (req, res, next) => {
  const { jw } = req;
  const { userId } = req.params;
  if (jw.user.id !== +userId) {
    throw new AccessLimitError();
  }
  new TaskCardModel()
    .query({ where: { createrId: jw.user.id, type: 'TODO' } })
    .fetchAll()
    .then(taskCards => res.send(taskCards))
    .catch(next);
});

TodoRouter.post('/todo', authJwt, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    validateRequest(req.body, 'content', ['required']);
    const { jw } = req;

    const createdTodoId: string = await todoService.createTodo({
      userId: jw.user.id,
      content: req.body.content,
      deadline: req.body.deadline,
      boxId: req.body.todoBoxId,
    });
    res.send(createdTodoId);
  } catch (error) {
    next(error);
  }
});

TodoRouter.delete('/todo/:todoId', authJwt, async (req, res) => {
  const { todoId } = req.params;
  await TodoModel.forge({ id: todoId }).save({ isDelete: true });
  res.status(202).send();
});

TodoRouter.patch('/todo/:todoId', authJwt, (req, res, next) => {
  TodoModel.where({
    id: req.params.todoId
  })
    .fetch()
    .then(todo => {
      todo.save(req.body).then(newTodo => {
        res.send(newTodo);
      });
    })
    .catch(next);
});

TodoRouter.patch('/user/:userId/todo/:todoId', authJwt, (req, res, next) => {
  TodoModel.where({
    id: req.params.todoId
  })
    .fetch()
    .then(todo => {
      todo.save(req.body).then(todo => {
        res.send(todo);
      });
    })
    .catch(next);
});

export { TodoRouter };
