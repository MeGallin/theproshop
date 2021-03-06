import React from 'react';
import { Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { logout } from '../actions/userActions';
import { Link } from 'react-router-dom';
import SearchBox from './SearchBox';

export const Header = ({ history }) => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const cartItems = cart;
  const inCart = cartItems.cartItems.map((item) => item.name);
  const numberOfItemsInCart = cartItems.cartItems.length;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>May Shop</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Route
              render={({ history }) => <SearchBox history={history} />}
            ></Route>

            <div className="ms-auto">
              <Nav>
                <LinkContainer to="/cart">
                  <Nav.Link>
                    {numberOfItemsInCart > 0 ? (
                      <span
                        className="cartQty"
                        title={`${numberOfItemsInCart} item in cart ${inCart}`}
                      >
                        {numberOfItemsInCart}
                      </span>
                    ) : null}
                    <i className="fas fa-shopping-cart"></i> Cart{' '}
                  </Nav.Link>
                </LinkContainer>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="username">
                    <NavDropdown.Item as={Link} to="/profile">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/" onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <i className="fas fa-user"></i> Sign In
                    </Nav.Link>
                  </LinkContainer>
                )}
                {userInfo && userInfo.isAdmin ? (
                  <NavDropdown title="admin" id="adminMenu">
                    <NavDropdown.Item as={Link} to="/admin/userlist">
                      Users
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/productlist">
                      Products
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/orderlist">
                      Orders
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : null}
              </Nav>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
