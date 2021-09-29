import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import { listProducts } from '../actions/productActions';

const HomeScreen = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  const productList = useSelector((state) => state.listProducts);

  const { loading, error, products } = productList;

  return (
    <>
      <h1>Latest Products</h1>
      {loading ? (
        <h2>LOADIN</h2>
      ) : error ? (
        <h3>{error}</h3>
      ) : (
        <Row>
          {products !== undefined && products.length
            ? products.map((product) => {
                return (
                  <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                    <Product product={product} />
                  </Col>
                );
              })
            : null}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;
