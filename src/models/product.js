export default (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      price: { type: DataTypes.FLOAT, allowNull: false },
      stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      categoryId: { type: DataTypes.INTEGER },
      imageUrl: { type: DataTypes.STRING },
    }
  );
  return Product;
};
