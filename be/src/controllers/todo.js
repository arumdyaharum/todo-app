import { Todo as TodoModel } from "../models/index.js";

class Todo {
  async getTodos (req, res) {
    const { user } = req;

    try {
      const todos = await TodoModel.findAll({
        order: [
          ['createdAt', 'DESC']
        ],
        where: {
          userId: user.id
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
    const { title } = req.body;

    try {
      const todo = await TodoModel.create({
        title,
        userId: user.id,
      })
  
      if (todo) {
        return res.status(201).json({ message: 'To-do is created!', todoId: todo.id });
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
    const { completed, title } = req.body;

    try {
      const todo = await TodoModel.findOne({
        where: {
          id: todoId
        }
      });

      if (todo) {
        let updatedTodo = {}
        if (completed !== undefined || completed !== null) {
          updatedTodo.completed = completed
          todo.completed = completed
        }
        if (title !== undefined || title !== null) {
          updatedTodo.title = title
          todo.title = title
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

  async deleteTodo (req, res) {
    const { todoId } = req.params;

    try {
      const todo = await TodoModel.findOne({
        where: {
          id: todoId,
        }
      });

      if (todo) {
        const deletedTodo = await TodoModel.destroy({
          where: {
            id: todoId
          },
        });
        return res.status(200).json({ message: 'To-do is deleted!', todoId: todoId });
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