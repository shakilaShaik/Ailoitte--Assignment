import db from '../models/index.js';
import { Op } from 'sequelize';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export async function createProduct(req, res) {
  try {
    const { name, description, price, stock, categoryId } = req.body;
    let imageUrl = null;
    if (req.file) {
      const upload = await uploadToCloudinary(req.file);
      imageUrl = upload.secure_url;
    }
    const product = await db.Product.create({ name, description, price, stock, categoryId, imageUrl });
    return res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function updateProduct(req, res) {
  try {
    const id = req.params.id;
    const product = await db.Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const updates = req.body;
    if (req.file) {
      const upload = await uploadToCloudinary(req.file);
      updates.imageUrl = upload.secure_url;
    }
    await product.update(updates);
    return res.json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteProduct(req, res) {
  try {
    const id = req.params.id;
    const product = await db.Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function listAllProductsAdmin(req, res) {
  const products = await db.Product.findAll({ include: [{ model: db.Category, as: 'category' }] });
  return res.json(products);
}

export async function listProducts(req, res) {
  try {
    const { minPrice, maxPrice, category, search, page = 1, limit = 10 } = req.query;
    const where = {};
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (category) where.categoryId = parseInt(category);
    const offset = (page - 1) * limit;
    const { rows, count } = await db.Product.findAndCountAll({
      where,
      include: [{ model: db.Category, as: 'category' }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    return res.json({ data: rows, total: count, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
