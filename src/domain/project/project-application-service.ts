import { ProjectSetting } from './model/project-setting';
import { Project } from './model/project';
import { ProjectRepository } from './project-repository';

export class ProjectAppliactionService {
    static getUserProjects(userId: number): Promise<Project[]> {
        return ProjectRepository.getUserProject(userId);
    }

    static getProjectDetail(projectId: string): Promise<Project> {
        return ProjectRepository.getProjectDetail(projectId);
    }

    static createProject(projectData: any): Promise<string> {
        const project = new Project({
            id: projectData.id,
            name: projectData.name,
            desc: projectData.desc,
            type: projectData.type,
            status: projectData.status,
            creatorId: projectData.creatorId,
            updatedAt: null,
            createdAt: null,
            setting: new ProjectSetting({
                id: null,
                cover: null
            })
        });
        return ProjectRepository.saveProject(project);
    }

    

}