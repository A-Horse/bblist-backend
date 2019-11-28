import { FileService } from '../../service/file.service';
import { CreateKanbanInput, KanbanId } from '../../typing/kanban.typing';
import { KanbanRepository } from '../kanban/kanban-repository';
import { Project } from './model/project';
import { ProjectIdFactory } from './model/project-id-factory';
import { ProjectSetting } from './model/project-setting';
import { ProjectRepository } from './project-repository';

export class ProjectAppliactionService {
  static getUserProjects(userId: number): Promise<Project[]> {
    return ProjectRepository.getUserProjects(userId);
  }

  static getProjectDetail(projectId: string): Promise<Project> {
    return ProjectRepository.getProjectDetail(projectId);
  }

  static async createProject(projectData: any): Promise<string> {
    const idFactory = new ProjectIdFactory();
    const id = await idFactory.generateId();

    const project = new Project({
      id: id,
      name: projectData.name,
      desc: projectData.desc,
      type: projectData.type,
      status: projectData.status,
      creatorId: projectData.creatorId,
      updatedAt: null,
      createdAt: null,
      setting: new ProjectSetting({
        id: null
      })
    });
    return ProjectRepository.saveProject(project);
  }

  static async createProjectKanban(
    createKanbanInput: CreateKanbanInput
  ): Promise<KanbanId> {
    const project: Project = await ProjectRepository.getProjectDetail(
      createKanbanInput.projectId
    );

    const kanban = await project.createKanban(createKanbanInput);
    return await KanbanRepository.savekanban(kanban);
  }

  static async setProjectDefaultKanban({ projectId, kanbanId }): Promise<void> {
    const project: Project = await ProjectRepository.getProjectDetail(projectId);

    await project.setDefaultKanban(kanbanId);
  }

  static async updateProjectCover(projectId: string, coverBase64: string) {
    const filename: string = await FileService.saveBase64Image(coverBase64);

    const project: Project = await ProjectRepository.getProjectDetail(projectId);

    await project.setCover(filename);
    return filename;
  }
}
