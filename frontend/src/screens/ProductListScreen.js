import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import {
  listProducts,
  deleteProduct,
  createProduct,
} from '../actions/productActions';
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
} from '../constants/productConstants';

const ProductListScreen = ({ history, match }) => {
  const dispatch = useDispatch();
  const pageNumber = match.params.pageNumber || 1;

  const productList = useSelector((state) => state.listProducts);
  const { loading, error, products, page, pages } = productList;

  const [newProducts, setNewProducts] = useState(products);

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Search functions
  const sortByProductStockCountUp = (a, b) => {
    return parseInt(a.countInStock) - parseInt(b.countInStock);
  };
  const sortByProductStockCountDown = (a, b) => {
    return parseInt(b.countInStock) - parseInt(a.countInStock);
  };
  const sortByDescriptionUp = (a, b) => {
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    else if (a.name.toLowerCase() === b.name.toLowerCase()) return 0;
    else return -1;
  };
  const sortByDescriptionDown = (a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
    else if (a.name.toLowerCase() === b.name.toLowerCase()) return 0;
    else return -1;
  };

  const handleSort = (val) => {
    const newProducts = [...products];
    switch (val) {
      case 'stockUp':
        products.sort(sortByProductStockCountUp);
        break;
      case 'stockDown':
        products.sort(sortByProductStockCountDown);
        break;
      case 'descriptionUp':
        products.sort(sortByDescriptionUp);
        break;
      case 'descriptionDown':
        products.sort(sortByDescriptionDown);
        break;
      default:
        return;
    }
    setNewProducts(newProducts);
  };
  useEffect(() => {
    setNewProducts(newProducts);
  }, [newProducts]);
  // END Search functions

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    dispatch({ type: PRODUCT_DELETE_RESET });

    if (!userInfo.isAdmin) {
      history.push('/login');
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts('', pageNumber));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);

  const deleteHandler = (userId) => {
    if (window.confirm('Are you sure ?')) {
      // Delete products Dispatch method
      dispatch(deleteProduct(userId));
    }
  };

  const createProductHandler = () => {
    // dispatch create products
    dispatch(createProduct());
  };

  return (
    <>
      <div className="wrapper">
        <div>
          <h1>Products</h1>
        </div>
        <div>
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus" /> Create Product
          </Button>
        </div>
      </div>

      {loadingDelete ? <Loader /> : null}
      {errorDelete ? <Message variant="danger">{errorDelete}</Message> : null}

      {loadingCreate ? <Loader /> : null}
      {errorCreate ? <Message variant="danger">{errorCreate}</Message> : null}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>
                  <div className="wrapper">
                    <span onClick={() => handleSort('descriptionUp')}>
                      {' '}
                      <i className="fas fa-arrow-up" />
                    </span>
                    <span> Description </span>
                    <span onClick={() => handleSort('descriptionDown')}>
                      {' '}
                      <i className="fas fa-arrow-down" />
                    </span>
                  </div>
                </th>
                <th>
                  <div className="wrapper">
                    <span onClick={() => handleSort('stockUp')}>
                      {' '}
                      <i className="fas fa-arrow-up" />
                    </span>
                    <span> Stock </span>
                    <span onClick={() => handleSort('stockDown')}>
                      {' '}
                      <i className="fas fa-arrow-down" />
                    </span>
                  </div>
                </th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>
                    <Row>
                      <Col md={2}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fluid
                          rounded
                        />
                      </Col>
                      <Col md={8}>{product.name}</Col>
                    </Row>
                  </td>
                  <td>{product.countInStock}</td>
                  <td>£{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <Row>
                      <LinkContainer to={`/admin/product/${product._id}/edit`}>
                        <Button variant="dark" className="btn btn-sm">
                          Edit
                        </Button>
                      </LinkContainer>

                      <Button
                        variant="danger"
                        className="btn btn-sm"
                        onClick={() => deleteHandler(product._id)}
                      >
                        Delete
                      </Button>
                    </Row>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate page={page} pages={pages} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
