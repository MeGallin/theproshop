import React, { useState } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());

    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push('/');
    }
  };

  const handleClearSearch = () => {
    setKeyword('');
    history.push('/');
  };

  return (
    <div className="d-flex flex-row ">
      <InputGroup>
        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
        <FormControl
          type="text"
          name="q"
          onChange={submitHandler}
          placeholder="SEARCH"
          aria-label="SEARCH"
          aria-describedby="basic-addon1"
          value={keyword}
        />
      </InputGroup>

      {keyword ? (
        <>
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
    </div>
  );
};

export default SearchBox;
