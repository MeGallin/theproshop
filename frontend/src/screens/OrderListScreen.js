import React, { useEffect, useState } from 'react';
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

  const [newOrders, setNewOrders] = useState(orders);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      history.push('/login');
    }
  }, [dispatch, history, userInfo]);

  // Start Search functions
  const sortByNameUp = (a, b) => {
    if (a.user.name.toLowerCase() > b.user.name.toLowerCase()) return 1;
    else if (a.user.name.toLowerCase() === b.user.name.toLowerCase()) return 0;
    else return -1;
  };
  const sortByNameDown = (a, b) => {
    if (a.user.name.toLowerCase() < b.user.name.toLowerCase()) return 1;
    else if (a.user.name.toLowerCase() === b.user.name.toLowerCase()) return 0;
    else return -1;
  };

  const sortByTotalUp = (a, b) => {
    return parseInt(a.totalPrice) - parseInt(b.totalPrice);
  };
  const sortByTotalDown = (a, b) => {
    return parseInt(b.totalPrice) - parseInt(a.totalPrice);
  };

  const sortByPaidOnUp = (a, b) => {
    return new Date(a.paidAt) - new Date(b.paidAt);
  };
  const sortByPaidOnDown = (a, b) => {
    return new Date(b.paidAt) - new Date(a.paidAt);
  };

  const deliveredOnUp = (a, b) => {
    return new Date(a.deliveredAt) - new Date(b.deliveredAt);
  };
  const deliveredOnDown = (a, b) => {
    return new Date(b.deliveredAt) - new Date(a.deliveredAt);
  };

  const handleSort = (val) => {
    const newOrders = [...orders];
    switch (val) {
      case 'nameUp':
        orders.sort(sortByNameUp);
        break;
      case 'nameDown':
        orders.sort(sortByNameDown);
        break;
      case 'totalUp':
        orders.sort(sortByTotalUp);
        break;
      case 'totalDown':
        orders.sort(sortByTotalDown);
        break;
      case 'paidOnUp':
        orders.sort(sortByPaidOnUp);
        break;
      case 'paidOnDown':
        orders.sort(sortByPaidOnDown);
        break;
      case 'deliveredOnUp':
        orders.sort(deliveredOnUp);
        break;
      case 'deliveredOnDown':
        orders.sort(deliveredOnDown);
        break;
      default:
        return;
    }
    setNewOrders(newOrders);
  };
  useEffect(() => {
    setNewOrders(newOrders);
  }, [newOrders]);
  // END Search functions

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
              <th>
                <div className="wrapper">
                  <span onClick={() => handleSort('nameUp')}>
                    {' '}
                    <i className="fas fa-arrow-up arrow-hover" />
                  </span>
                  <span> Name </span>
                  <span onClick={() => handleSort('nameDown')}>
                    {' '}
                    <i className="fas fa-arrow-down arrow-hover" />
                  </span>
                </div>
              </th>
              <th>CREATED</th>
              <th>
                <div className="wrapper">
                  <span onClick={() => handleSort('totalUp')}>
                    {' '}
                    <i className="fas fa-arrow-up arrow-hover" />
                  </span>
                  <span> TOTAL </span>
                  <span onClick={() => handleSort('totalDown')}>
                    {' '}
                    <i className="fas fa-arrow-down arrow-hover" />
                  </span>
                </div>
              </th>
              <th>
                <div className="wrapper">
                  <span onClick={() => handleSort('paidOnUp')}>
                    {' '}
                    <i className="fas fa-arrow-up arrow-hover" />
                  </span>
                  <span>PAID</span>
                  <span onClick={() => handleSort('paidOnDown')}>
                    {' '}
                    <i className="fas fa-arrow-down arrow-hover" />
                  </span>
                </div>
              </th>
              <th>
                <div className="wrapper">
                  <span onClick={() => handleSort('deliveredOnUp')}>
                    {' '}
                    <i className="fas fa-arrow-up arrow-hover" />
                  </span>
                  <span>DELIVERED</span>
                  <span onClick={() => handleSort('deliveredOnDown')}>
                    {' '}
                    <i className="fas fa-arrow-down arrow-hover" />
                  </span>
                </div>
              </th>
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
                <td style={{ fontSize: '0.6em' }}>
                  {order.createdAt.substring(0, 10)}
                </td>
                <td>
                  {order.totalPrice.toLocaleString('en-UK', {
                    style: 'currency',
                    currency: 'GBP',
                  })}
                </td>
                <td style={{ fontSize: '0.6em' }}>
                  {order.isPaid ? (
                    <>
                      <i className="fa fa-check" style={{ color: 'green' }}></i>
                      <div className="p-1 bg-info text-white">
                        <div>{order.paidAt.substring(0, 10)}</div>
                        <div>{order.paidAt.substring(11, 22)}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-times" style={{ color: 'red' }}></i>
                      <div className="p-3 bg-warning text-white">Not Paid</div>
                    </>
                  )}
                </td>
                <td style={{ fontSize: '0.6em' }}>
                  {order.isDelivered ? (
                    <>
                      <i className="fa fa-check" style={{ color: 'green' }}></i>
                      <div className="p-3 bg-info text-white">
                        {order.deliveredAt.substring(0, 10)}
                      </div>
                    </>
                  ) : (
                    <>
                      <i className="fa fa-times" style={{ color: 'red' }}></i>
                      <div className="p-3 bg-warning text-white">
                        Not Delivered
                      </div>
                    </>
                  )}
                </td>
                <td>
                  {/* <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn btn-sm">
                      Edit
                    </Button>
                  </LinkContainer> */}

                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="primary" className="btn btn-sm">
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
