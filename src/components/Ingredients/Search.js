import React, { useState, useEffect, useRef } from "react";
import useHttp from "../../hooks/http";
import Card from "../UI/Card";
import "./Search.css";
import ErrorModal from "../UI/ErrorModal";

const Search = React.memo((props) => {
  const [enteredFilter, setEnteredFilter] = useState("");
  const { filter } = props;
  const inputRef = useRef();

  const { isLoading, error, data, sendRequest, clearError } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const url =
          "https://hookspractice-868d9-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json";
        sendRequest(url);
      }
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const fetchedIngredients = [];
      for (let key in data) {
        let ingredientEntry = {
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        };
        fetchedIngredients.push(ingredientEntry);
      }
      const applyFilter = fetchedIngredients.filter((ingredient) => {
        return ingredient.title.includes(enteredFilter);
      });

      filter(applyFilter);
    }
  }, [data, filter]);

  const handleInputChange = (event) => {
    setEnteredFilter(event.target.value);
  };

  return (
    <section className="search">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>...Loading...</span>}
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={handleInputChange}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
