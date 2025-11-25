import db from '../models/index.js';

export async function placeOrder(req, res) {
  const userId = req.user.id;
  const cart = await db.Cart.findOne({ where: { userId }, include: [{ model: db.CartItem, as: 'items' }] });
  if (!cart || !cart.items || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

  const t = await db.sequelize.transaction();
  try {
    const order = await db.Order.create({ userId, total: 0 }, { transaction: t });
    let total = 0;
    for (const item of cart.items) {
      const product = await db.Product.findByPk(item.productId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!product) throw new Error('Product not found while placing order');
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for product ${product.id}`);
      // reduce stock
      await product.decrement('stock', { by: item.quantity, transaction: t });
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      await db.OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }, { transaction: t });
    }
    order.total = total;
    order.status = 'completed';
    await order.save({ transaction: t });
    // clear cart
    await db.CartItem.destroy({ where: { cartId: cart.id }, transaction: t });
    await t.commit();
    const created = await db.Order.findByPk(order.id, { include: [{ model: db.OrderItem, as: 'items', include: [{ model: db.Product, as: 'product' }] }] });
    return res.status(201).json(created);
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
}

export async function orderHistory(req, res) {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const { rows, count } = await db.Order.findAndCountAll({
    where: { userId },
    include: [{ model: db.OrderItem, as: 'items', include: [{ model: db.Product, as: 'product' }] }],
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });
  return res.json({ total: count, page, totalPages: Math.ceil(count/limit), orders: rows });
}
