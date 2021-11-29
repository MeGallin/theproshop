import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { contactFormMessage } from '../actions/formActions';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { CONTACT_FORM_RESET } from '../constants/formConstants';

const ContactForm = () => {
  const dispatch = useDispatch();

  const contactForm = useSelector((state) => state.contactForm);
  const { loading, error, success, payload } = contactForm;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch({ type: CONTACT_FORM_RESET });
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(contactFormMessage(name, email, message));
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <FormContainer>
      <h1>Contact Us</h1>
      {error ? <Message variant="danger">{error}</Message> : null}
      {loading ? <Loader></Loader> : null}
      {success ? <Message variant="success">{payload.message}</Message> : null}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="message">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Form.Group>

        <Button
          type="submit"
          variant="primary"
          disabled={!name || !email || !message}
        >
          Submit
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ContactForm;
