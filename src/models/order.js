export default (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      total: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      status: {
        type: DataTypes.ENUM("pending", "completed"),
        defaultValue: "pending",
      },
    }
  );
  return Order;
};
