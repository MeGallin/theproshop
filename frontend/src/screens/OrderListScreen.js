import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Col, Image, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listOrders } from '../actions/orderActions';

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      history.push('/login');
    }
  }, [dispatch, history, userInfo]);

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID ON</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <div>{order._id}</div>
                  <div>
                    {order.orderItems.map((item) => {
                      return (
                        <Row key={item._id}>
                          <Col md={2}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col md={10}>{item.name}</Col>
                        </Row>
                      );
                    })}
                  </div>
                </td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>£{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    <>
                      <div className="p-3 mb-2 bg-info text-white">
                        {order.paidAt.substring(0, 10)}
                      </div>
                      <div>{order.paidAt.substring(11, 22)}</div>
                    </>
                  ) : (
                    <i className="fa fa-times" style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className="fa fa-times" style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  {/* <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn btn-sm">
                      Edit
                    </Button>
                  </LinkContainer> */}

                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="danger" className="btn btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
