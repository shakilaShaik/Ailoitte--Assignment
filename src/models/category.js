export default (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
    }
    
  );
  return Category;
};
