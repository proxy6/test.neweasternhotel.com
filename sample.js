// Sequelize Models
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

// Models
const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const Permission = sequelize.define('Permission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  table: { type: DataTypes.STRING, allowNull: false },
  action: { type: DataTypes.STRING, allowNull: false },
});

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
});

const UserRole = sequelize.define('UserRole', {});
const RolePermission = sequelize.define('RolePermission', {});

// Associations
Role.belongsToMany(Permission, { through: RolePermission });
Permission.belongsToMany(Role, { through: RolePermission });
User.belongsToMany(Role, { through: UserRole });
Role.belongsToMany(User, { through: UserRole });

// Sync models
sequelize.sync({ force: true });

// CRUD operations
async function createRoleWithPermissions(roleName, permissions) {
  const role = await Role.create({ name: roleName });
  for (const { table, actions } of permissions) {
    for (const action of actions) {
      const [permission] = await Permission.findOrCreate({ where: { table, action } });
      await role.addPermission(permission);
    }
  }
  return role;
}

async function getRolesWithPermissions() {
  return await Role.findAll({ include: Permission });
}

async function updateRolePermissions(roleId, permissions) {
  const role = await Role.findByPk(roleId);
  await role.setPermissions([]);
  for (const { table, actions } of permissions) {
    for (const action of actions) {
      const [permission] = await Permission.findOrCreate({ where: { table, action } });
      await role.addPermission(permission);
    }
  }
  return role;
}

async function deleteRole(roleId) {
  return await Role.destroy({ where: { id: roleId } });
}

async function assignRoleToUser(userId, roleId) {
  const user = await User.findByPk(userId);
  const role = await Role.findByPk(roleId);
  await user.addRole(role);
  return user;
}

async function getUserRoles(userId) {
  return await User.findByPk(userId, { include: Role });
}

async function updateUserRoles(userId, roleIds) {
  const user = await User.findByPk(userId);
  const roles = await Role.findAll({ where: { id: roleIds } });
  await user.setRoles(roles);
  return user;
}

async function removeRoleFromUser(userId, roleId) {
  const user = await User.findByPk(userId);
  const role = await Role.findByPk(roleId);
  await user.removeRole(role);
  return user;
}

async function checkUserPermission(userId, table, action) {
  const user = await User.findByPk(userId, {
    include: {
      model: Role,
      include: Permission,
    },
  });

  const hasPermission = user.Roles.some(role =>
    role.Permissions.some(perm => perm.table === table && perm.action === action)
  );

  return hasPermission;
}

module.exports = {
  createRoleWithPermissions,
  getRolesWithPermissions,
  updateRolePermissions,
  deleteRole,
  assignRoleToUser,
  getUserRoles,
  updateUserRoles,
  removeRoleFromUser,
  checkUserPermission,
};
