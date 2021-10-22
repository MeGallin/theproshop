import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @description: Fetch all products
// @route: GET /api/products
// @access: Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @description: Fetch single product
// @route: GET /api/products/:id
// @access: Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @description: Delete a  single product
// @route: DELETE /api/products/:id
// @access: Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json('Product as been successfully removed');
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @description: CREATE a  single product
// @route: POST /api/products
// @access: Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Description',
  });

  const createProduct = await product.save();
  res.status(210).json(createProduct);
});

// @description: UPDATE a single product
// @route: PUT /api/products/:id
// @access: Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, image, brand, category, description, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.description = description;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
