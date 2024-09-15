import sequelize from "./setup.js";
import { DataTypes } from "sequelize";
import User from "./User.js";

const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    }
  },
}, {
  tableName: 'todos'
});

export default Todo;