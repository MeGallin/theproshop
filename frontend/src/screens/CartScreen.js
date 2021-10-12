import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from 'react-bootstrap';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';

const CartScreen = ({ match, location, history }) => {
  const dispatch = useDispatch();
  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;

  const cart = useSelector((state) => state.cart);
  const cartItems = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  // click Handlers
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>

        {cartItems.cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go Back</Link>{' '}
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fluid
                      rounded
                    ></Image>
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>
                      {item.quantity}-{item.name}
                    </Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value)),
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((n) => (
                        <option key={n + 1} value={n + 1}>
                          {n + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      types="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="fa fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Sub-Total (
                {cartItems.cartItems.reduce(
                  (acc, currentItem) => acc + currentItem.quantity,
                  0,
                )}
                ) items
              </h2>
              $
              {cartItems.cartItems
                .reduce(
                  (acc, currentItem) =>
                    acc + currentItem.quantity * currentItem.price,
                  0,
                )
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                types="button"
                className="col-12"
                disabled={cartItems.cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
