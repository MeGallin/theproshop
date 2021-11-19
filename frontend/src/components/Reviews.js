import React from 'react';
import { useSelector } from 'react-redux';
import Rating from './Rating';
import { Image, Carousel } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';

const Reviews = () => {
  const productList = useSelector((state) => state.listProducts);
  const { loading, error, products } = productList;

  return (
    <>
      <h6>Customer Reviews</h6>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Carousel pause="hover" className="bg-light">
          {products.map((product) =>
            product.reviews.map((review) => (
              <Carousel.Item key={review._id}>
                <div className="wrapper-review">
                  <div>
                    <Image src={product.image} alt={product.name} fluid />
                  </div>

                  <div className="img-match-padding">
                    <h6>{review.name} says:</h6> <div>{review.comment}</div>
                    <Rating value={review.rating} />
                  </div>
                </div>
              </Carousel.Item>
            )),
          )}
        </Carousel>
      )}
    </>
  );
};

export default Reviews;
