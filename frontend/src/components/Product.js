import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Rating from './Rating';
import Message from './Message';

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as="h3">
          {product.price.toLocaleString('en-UK', {
            style: 'currency',
            currency: 'GBP',
          })}
        </Card.Text>
        {product.countInStock > 0 ? (
          <Card.Text>{product.countInStock} in stock</Card.Text>
        ) : (
          <Message variant="danger">
            This product is currently out of stock
          </Message>
        )}
      </Card.Body>
    </Card>
  );
};

export default Product;
