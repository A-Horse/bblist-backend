import { ProjectEntity } from './../../../entity/project.entity';
import { ProjectSetting } from './project-setting';
import { ProjectStatus, ProjectType } from './../../../typing/project.typing';
import { runInThisContext } from 'vm';

export class Project {
  public id: string;
  public setting: ProjectSetting;
  public name: string;
  public desc: string;
  public type: ProjectType;
  public status: ProjectStatus;
  public creatorId: number;
  public ownerId: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor({
    id,
    name,
    desc,
    type,
    status,
    creatorId,
    createdAt,
    updatedAt,
    setting
  }) {
    this.id= id;
    this.name = name;
    this.desc = desc;
    this.type = type;
    this.status = status;
    this.creatorId = creatorId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.setting = setting;
  }

  public createKanban() {
    
  }

  public createKanbanCard() {
  }

  static fromDataEntity(dataEntity: ProjectEntity): Project {
    const setting = ProjectSetting.fromDataEntity(dataEntity.setting);

    const project = new Project({
      id: dataEntity.id,
      name: dataEntity.name,
      desc: dataEntity.desc,
      type: dataEntity.type,
      status: dataEntity.status,
      creatorId: dataEntity.creator.id,
      updatedAt: dataEntity.updatedAt,
      createdAt: dataEntity.createdAt,
      setting: setting
    });
    return project;
  }
  
}