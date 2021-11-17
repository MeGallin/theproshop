import React from 'react';
import { useSelector } from 'react-redux';
import Rating from './Rating';
import { Image, Carousel } from 'react-bootstrap';

const Reviews = () => {
  const productList = useSelector((state) => state.listProducts);
  const { products } = productList;
  console.log(products);
  return (
    <>
      <h6>Customer Reviews</h6>

      <Carousel pause="hover" className="bg-light">
        {products.map((products) =>
          products.reviews.map((review) => (
            <Carousel.Item key={review._id}>
              <Image
                src={products.image}
                alt={products.name}
                fluid
                className="card-img-top"
              />
              <Carousel.Caption className="carousel-caption">
                Reviewed by {review.name}:{review.comment}
                <p>
                  <Rating value={review.rating} />
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          )),
        )}
      </Carousel>
    </>
  );
};

export default Reviews;
