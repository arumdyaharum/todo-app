import sequelize from "./setup.js";
import { DataTypes } from "sequelize";
import User from "./User.js";

const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  prefix: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    }
  },
}, {
  tableName: 'projects'
});

export default Project;