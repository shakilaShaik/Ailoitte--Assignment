import db from '../models/index.js';

export async function createCategory(req, res) {
  try {
    const { name, description } = req.body;
    const cat = await db.Category.create({ name, description });
    return res.status(201).json(cat);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function updateCategory(req, res) {
  try {
    const id = req.params.id;
    const cat = await db.Category.findByPk(id);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    await cat.update(req.body);
    return res.json(cat);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function deleteCategory(req, res) {
  try {
    const id = req.params.id;
    const cat = await db.Category.findByPk(id);
    if (!cat) return res.status(404).json({ message: 'Not found' });
    await cat.destroy();
    return res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function listCategories(req, res) {
  const cats = await db.Category.findAll();
  return res.json(cats);
}
