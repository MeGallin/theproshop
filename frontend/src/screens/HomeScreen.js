import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col } from 'react-bootstrap';
import Product from '../components/Product';
import { listProducts } from '../actions/productActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  const productList = useSelector((state) => state.listProducts);
  const { loading, error, products, page, pages } = productList;

  // Function to calculate DISPLAYED number of listed products
  const productCount = () => {
    const filteredProducts = products.filter((product) => {
      return product.isDelayed;
    });
    return Number(products.length) - Number(filteredProducts.length);
  };
  // Function to calculate DISPLAYED number of listed products

  return (
    <>
      {!keyword ? <ProductCarousel /> : null}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <div className="product-heading-length">
            <h1>Latest Products </h1>
            <span>{productCount()} product(s) listed</span>
          </div>
          <div className="wrapper">
            {products !== undefined && products.length ? (
              products.map((product) => {
                return !product.isDelayed ? (
                  <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                    <Product product={product} />
                  </Col>
                ) : null;
              })
            ) : (
              <Message variant="danger">Sorry no products found</Message>
            )}
          </div>
          <Paginate
            page={page}
            pages={pages}
            keyword={keyword ? keyword : ''}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;
