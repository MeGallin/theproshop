import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listUsers, deleteUser } from '../actions/userActions';

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const [newUsers, setNewUsers] = useState(users);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      history.push('/login');
    }
  }, [dispatch, history, userInfo, successDelete]);

  const deleteHandler = (userId) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteUser(userId));
    }
  };

  // Start Search functions
  const sortByNameUp = (a, b) => {
    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
    else if (a.name.toLowerCase() === b.name.toLowerCase()) return 0;
    else return -1;
  };
  const sortByNameDown = (a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
    else if (a.name.toLowerCase() === b.name.toLowerCase()) return 0;
    else return -1;
  };

  const handleSort = (val) => {
    const newUsers = [...users];
    switch (val) {
      case 'nameUp':
        users.sort(sortByNameUp);
        break;
      case 'nameDown':
        users.sort(sortByNameDown);
        break;

      default:
        return;
    }
    setNewUsers(newUsers);
  };
  useEffect(() => {
    setNewUsers(newUsers);
  }, [newUsers]);
  // END Search functions

  return (
    <>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>Client ID</th>
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
              <th>Email</th>
              <th>Is ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  {' '}
                  <a href={`mailto:${user.email}`}> {user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className="fa fa-check" style={{ color: 'green' }}></i>
                  ) : (
                    <i className="fa fa-times" style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn btn-sm">
                      Edit
                    </Button>
                  </LinkContainer>

                  <Button
                    variant="danger"
                    className="btn btn-sm"
                    disabled={user.isAdmin}
                    onClick={() => deleteHandler(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
