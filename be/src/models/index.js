import User from "./User.js";
import Todo from "./Todo.js";
import Project from "./Project.js";

User.hasMany(Todo, {
  foreignKey: 'user_id',
});

User.hasMany(Project, {
  foreignKey: 'user_id',
})

Todo.belongsTo(User, {
  foreignKey: 'user_id',
});

Project.belongsTo(User, {
  foreignKey: 'user_id',
});

Project.hasMany(Todo, {
  foreignKey: 'project_id',
  onDelete: 'CASCADE',
});

Todo.belongsTo(Project, {
  foreignKey: 'project_id',
});

export {
  User,
  Todo,
  Project,
}
