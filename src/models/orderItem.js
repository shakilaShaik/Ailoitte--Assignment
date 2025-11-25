export default (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false } // snapshot price
  }, {});
  return OrderItem;
};
