const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Role = require('./roles');
const Permission = require('./permission');

const RolePermissions = sequelize.define('RolePermissions', {

}, {
  timestamps: true,   // Ensure timestamps are on
  tableName: 'RolePermissions', 
});

Role.belongsToMany(Permission, { through: RolePermissions });
Permission.belongsToMany(Role, { through: RolePermissions });
module.exports = RolePermissions;
