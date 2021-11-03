import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push('/');
    }
  };

  const handleClearSearch = () => {
    console.log(keyword);
    setKeyword('');
    history.push('/');
  };
  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="SEARCH"
        className="mr-sm-2 ml-sm-5"
        value={keyword}
      ></Form.Control>

      {keyword ? (
        <>
          <Button
            type="submit"
            variant="outline-success"
            className="p-2"
            disabled={!keyword}
          >
            Search
          </Button>

          <Button
            type="submit"
            variant="outline-warning"
            className="p-2"
            disabled={!keyword}
            onClick={() => handleClearSearch()}
          >
            Clear
          </Button>
        </>
      ) : null}
    </Form>
  );
};

export default SearchBox;
