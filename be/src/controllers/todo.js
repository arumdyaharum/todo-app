import { Project, Todo as TodoModel } from "../models/index.js";

class Todo {
  async getTodos (req, res) {
    const { user } = req;
    const { projectName } = req.query;

    try {
      const projectSearch = projectName ? { where: { name: projectName } } : {}
      const todos = await TodoModel.findAll({
        attributes: ['id', 'title', 'completed', 'createdAt'],
        include: [{
          model: Project,
          attributes: ['id', 'name', 'prefix'],
          ...projectSearch,
        }],
        order: [
          ['createdAt', 'DESC']
        ],
        where: {
          user_id: user.id
        }
      })
  
      if (todos && todos.length > 0) {
        res.status(200).json({message: "Get all to-dos is successfull!", data: todos});
      } else if (todos && todos.length === 0) {
        res.status(200).json({message: "To-dos is empty", data: todos});
      }
    } catch(err) {
      console.log("Error:", err, "===err");
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    }
  }

  async createTodo (req, res) {
    const { user } = req;
    const { title, project_prefix = null } = req.body;
    console.log("🎀 > Todo > project_prefix:", project_prefix)

    try {
      let project_id = null
      if (project_prefix) {
        const project = await Project.findOne({
          where: {
            prefix: project_prefix
          }
        })
        if (project) project_id = project.id
      }
      const todo = await TodoModel.create({
        title,
        user_id: user.id,
        project_id,
      })
  
      if (todo) {
        return res.status(201).json({ message: 'To-do is created!', todo_id: todo.id });
      }
    } catch(err) {
      console.log("Error:", err, "===err");
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    }
  }

  async updateTodo (req, res) {
    const { todoId } = req.params;
    const { completed, title, project_id = null } = req.body;

    try {
      const todo = await TodoModel.findByPk(todoId);

      if (!todo) {
        return res.status(404).json({ message: 'To-do is not found!' });
      }

      let updatedTodo = {}
      if (completed !== undefined && completed !== null) {
        updatedTodo.completed = completed
        todo.completed = completed
      }
      if (title !== undefined && title !== null) {
        updatedTodo.title = title
        todo.title = title
      }
      if (project_id !== undefined && project_id !== null) {
        updatedTodo.project_id = project_id
        todo.project_id = project_id
      }
      updatedTodo = await TodoModel.update(updatedTodo, {
        where: {
          id: todoId
        },
      })
      return res.status(200).json({
        message: 'To-do is updated!', 
        data: todo
      });
    } catch(err) {
      console.log("Error:", err, "===err");
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    }
  }

  async deleteTodo (req, res) {
    const { todoId } = req.params;

    try {
      const todo = await TodoModel.findByPk(todoId)

      if (todo) {
        const deletedTodo = await TodoModel.destroy({
          where: {
            id: todoId
          },
        });
        return res.status(200).json({ message: 'To-do is deleted!', todo_id: todoId });
      } else {
        return res.status(404).json({ message: 'To-do is not found!' });
      }
    } catch(err) {
      console.log("Error:", err, "===err");
      res.status(500).json({
        message: "Internal server error",
        error: err,
      });
    }
  }
}

export default new Todo();