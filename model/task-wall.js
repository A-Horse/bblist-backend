import {
  bookshelf
} from '../db/bookshelf.js';

import {TaskListModel} from './task-list';

export const TaskWallModel = bookshelf.Model.extend({
  tableName: 'task-wall'
});

import {Group} from './group';
import {TaskList, DEFAULT_LIST_NAME} from './task-list';

export const TASKWALL_TYPE = {
  NORMAL: 'NORMAL'
}

export class TaskWall {
  constructor(info) {
    this.model = new TaskWallModel(info);
    return this;
  }

  bundleCreate() {
    const self = this;
    return new Promise(function(resolve, reject){
      bookshelf.transaction(function(t){
        self.model.save(null, {transacting: t})
          .tap(function(taskWall){
            Promise.all([
              new TaskList({
                taskWallId: taskWall.get('id')
              }).model.save(null, {transacting: t}),
              new Group({
                taskWallId: taskWall.get('id'),
                userId: taskWall.get('ownerId'),
                accessLevel: 1
              }).model.save(null, {transacting: t})
            ]).then(() => {
              t.commit();
              resolve(taskWall);
            }).catch(error => {
              t.rollback();
              reject(error);
            });
          });
      });
    });
  }

  static createTaskWall(info) {
    return new TaskWall(info);
  }

  static getTaskWall(info) {
    return new TaskWallModel(info);
  }

  static getModel() {
    return TaskWallModel;
  }
}
