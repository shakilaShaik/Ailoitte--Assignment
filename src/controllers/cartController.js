import db from '../models/index.js';

/**
 * Cart semantics:
 * - Cart belongs to User
 * - CartItem stores productId, quantity, price (persistent price)
 */

export async function viewCart(req, res) {
  const cart = await db.Cart.findOne({ where: { userId: req.user.id }, include: [{ model: db.CartItem, as: 'items', include: [{ model: db.Product, as: 'product' }] }] });
  if (!cart) return res.json({ items: [] });
  return res.json(cart);
}

export async function addToCart(req, res) {
  const { productId, quantity } = req.body;
  const userId = req.user.id;
  const product = await db.Product.findByPk(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  let cart = await db.Cart.findOne({ where: { userId } });
  if (!cart) cart = await db.Cart.create({ userId });
  // price at add
  const price = product.price;
  let item = await db.CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (item) {
    item.quantity += parseInt(quantity);
    await item.save();
  } else {
    item = await db.CartItem.create({ cartId: cart.id, productId, quantity, price });
  }
  return res.json(item);
}

export async function removeFromCart(req, res) {
  const { productId } = req.body;
  const userId = req.user.id;
  const cart = await db.Cart.findOne({ where: { userId } });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  const item = await db.CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (!item) return res.status(404).json({ message: 'Item not found' });
  await item.destroy();
  return res.json({ message: 'Removed' });
}
