import { Project as ProjectModel } from "../models/index.js";

class Project {
  async getProjects(req, res) {
    const { user } = req

    try {
      const projects = await ProjectModel.findAll({
        where: {
          user_id: user.id
        },
        order: [
          ['createdAt', 'DESC'],
        ],
      });
      if (projects && projects.length > 0) {
        res.status(200).json({message: "Get all projects is successfull!", data: projects});
      } else {
        res.status(200).json({message: "Projects is empty", data: projects});
      }
    } catch(err) {
      console.log("Error:", err, "===err");
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    }
  }

  async createProject(req, res) {
    const { user } = req
    const { name } = req.body

    try {
      const project = await ProjectModel.findOne({
        where: {
          name,
          user_id: user.id
        }
      })

      if (project) {
        return res.status(400).json({ message: 'Project already exists' });
      }

      const newProject = await ProjectModel.create({
        name,
        prefix: '/' + name.toLowerCase().split(' ').join('+'),
        user_id: user.id
      })

      return res.status(201).json({ message: 'Project created successfully', project_id: newProject.id });
    } catch(err) {
      console.log("Error:", err, "===err");
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    }
  }

  async editProject(req, res) {
    const { projectId } = req.params 
    const { name } = req.body

    try {
      const project = await ProjectModel.findByPk(projectId);

      if (!project) {
        return res.status(404).json({ message: 'To-do is not found!' });
      }


      const updatedProject = await ProjectModel.update({
        name, 
        prefix: '/' + name.toLowerCase().split(' ').join('+'),
      }, {
        where: {
          id: projectId,
        }
      })

      project.name = name
      project.prefix = '/' + name.toLowerCase().split(' ').join('+')

      return res.status(200).json({
        message: 'Project is updated!', 
        data: project
      });
    } catch(err) {
      console.log("Error:", err, "===err");
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    }
  }

  async deleteProject(req, res) {
    const { projectId } = req.params;

    try {
      const project = await ProjectModel.findByPk(projectId);

      if (!project) {
        return res.status(404).json({ message: 'To-do is not found!' });
      }

      const deletedProject = await ProjectModel.destroy({
        where: {
          id: projectId
        }
      })

      return res.status(200).json({ message: 'Project is deleted!', project_id: project.id });
    } catch(err) {
      console.log("Error:", err, "===err");
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    }
  }
}

export default new Project();