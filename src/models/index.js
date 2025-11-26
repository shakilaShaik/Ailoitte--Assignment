import path from 'path';
import Sequelize from 'sequelize';
import configObj from '../config/config.js';

const env = process.env.NODE_ENV || 'development';
const config = configObj[env];
let sequelize;

if (env === "production") {
  // Use DATABASE_URL and ssl
  sequelize = new Sequelize(config.url, {
    dialect: "postgres",
    dialectOptions: config.dialectOptions,
    logging: false, // optional
  });
} else {
  // Development
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: "postgres",
    dialectOptions: config.dialectOptions,
    logging: console.log,
  });
}


const db = {};
db.sequelize = sequelize;

// Import models
import UserModel from './user.js';
import CategoryModel from './category.js';
import ProductModel from './product.js';
import CartModel from './cart.js';
import CartItemModel from './cartItem.js';
import OrderModel from './order.js';
import OrderItemModel from './orderItem.js';

db.User = UserModel(sequelize, Sequelize.DataTypes);
db.Category = CategoryModel(sequelize, Sequelize.DataTypes);
db.Product = ProductModel(sequelize, Sequelize.DataTypes);
db.Cart = CartModel(sequelize, Sequelize.DataTypes);
db.CartItem = CartItemModel(sequelize, Sequelize.DataTypes);
db.Order = OrderModel(sequelize, Sequelize.DataTypes);
db.OrderItem = OrderItemModel(sequelize, Sequelize.DataTypes);

// Associations
db.Category.hasMany(db.Product, { foreignKey: 'categoryId', as: 'products' });
db.Product.belongsTo(db.Category, { foreignKey: 'categoryId', as: 'category' });

db.User.hasOne(db.Cart, { foreignKey: 'userId' });
db.Cart.belongsTo(db.User, { foreignKey: 'userId' });

db.Cart.hasMany(db.CartItem, { foreignKey: 'cartId', as: 'items' });
db.CartItem.belongsTo(db.Cart, { foreignKey: 'cartId' });
db.CartItem.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' });

db.User.hasMany(db.Order, { foreignKey: 'userId' });
db.Order.belongsTo(db.User, { foreignKey: 'userId' });

db.Order.hasMany(db.OrderItem, { foreignKey: 'orderId', as: 'items' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'orderId' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' });

export default db;
