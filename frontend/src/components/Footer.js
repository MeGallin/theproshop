import { Container, Row, Col } from 'react-bootstrap';
import React from 'react';
import Reviews from './Reviews';

const Footer = () => {
  return (
    <>
      <footer>
        <Container>
          <hr />
          <Row>
            <Col>
              <Reviews />
            </Col>
          </Row>

          <Row>
            <Col className="text-center py-3">CopyRight &copy; May Shop</Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Footer;
