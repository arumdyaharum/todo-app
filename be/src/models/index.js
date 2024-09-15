import User from "./User.js";
import Todo from "./Todo.js";

User.hasMany(Todo, {
  foreignKey: 'userId',
});

Todo.belongsTo(User, {
  foreignKey: 'userId',
});

export {
  User,
  Todo
}
