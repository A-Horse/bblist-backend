import * as express from 'express';
import { authJwt } from '../middle/jwt';
import { TaskList, TaskTrackModel } from '../../model/task-track';
import { Group } from '../../model/group';
import { AccessLimitError, NotFoundError } from '../../service/error';
import { validateRequest } from '../../service/validate';
import { taskBoardGroupForBody, taskBoardGroupForParams } from '../middle/board';

const TaskTrackRouter = express.Router();

TaskTrackRouter.get(
  '/task-board/:boardId/track/:trackId',
  authJwt,
  taskBoardGroupForBody,
  async (req, res) => {
    const { listId } = req.params;
    const taskTrack = await TaskList.getModel()
      .where({ id: listId })
      .fetch();

    if (!taskTrack) {
      throw new NotFoundError('not found this task list');
    }
    res.send(taskTrack);
  }
);

TaskTrackRouter.get(
  '/task-board/:boardId/track/:trackId/card',
  authJwt,
  taskBoardGroupForParams,
  async (req, res) => {
    try {
      const { trackId } = req.params;
      const taskTrack = await TaskTrackModel.where({ id: trackId }).fetch({
        withRelated: [
          {
            cards: () => {
              /*ignore*/
            },
            'cards.creater': qb => {
              qb.select('email', 'id');
            },
            'cards.owner': qb => {
              qb.select('email', 'id');
            }
          }
        ]
      });

      if (!taskTrack) {
        throw new NotFoundError('not found this task list');
      }
      res.json(taskTrack);
    } catch (error) {
      throw error;
    }
  }
);

TaskTrackRouter.post('/task-board/:boardId/track', async (req, res) => {
  validateRequest(req.body, 'name', ['required']);
  const { jw } = req;
  const { boardId } = req.params;

  const existNumber = await TaskTrackModel.where({ taskWallId: boardId }).count();
  const savedTrack = await new TaskTrackModel().save({
    index: existNumber,
    taskWallId: boardId,
    name: req.body.name
  });
  res.status(201).send({ ...savedTrack.serialize(), cards: [] });
});

TaskTrackRouter.patch('/task-board/:boardId/track/index', async (req, res) => {
  const { boardId } = req.params;
  const { trackIndexs } = req.body;
  const result = await Promise.all(
    trackIndexs.map(async trackIndex => {
      const track = await TaskTrackModel.forge({ id: trackIndex.id }).save({
        index: trackIndex.index
      });
      return track;
    })
  );
  res.status(200).json(result);
});

TaskTrackRouter.patch('/task-board/:wallId/track/:listId', async (req, res) => {
  const { listId } = req.params;
  const info = req.body;
  // TODO 检查是否存在
  const track = await new TaskTrackModel({ id: listId }).fetch();
  if (!track) {
    throw new NotFoundError('can not found this task track');
  }
  const newTrack = await track.save(info);
  return res.send(newTrack);
});

TaskTrackRouter.delete(
  '/task-board/:boardId/track/:listId',
  authJwt,
  taskBoardGroupForBody,
  async (req, res) => {
    const { boardId, listId } = req.params;
    const { jw } = req;

    await new TaskTrackModel({ id: listId }).bundleDelete();
    res.status(204).send();
  }
);

export { TaskTrackRouter };