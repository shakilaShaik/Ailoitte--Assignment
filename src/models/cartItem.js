export default (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    cartId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    price: { type: DataTypes.FLOAT, allowNull: false } // persistent price snapshot
  }, {});
  return CartItem;
};
