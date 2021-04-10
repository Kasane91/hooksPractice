import React, { useState } from "react";
import LoadingIndicator from "../UI/LoadingIndicator";

import Card from "../UI/Card";
import "./IngredientForm.css";

const IngredientForm = React.memo((props) => {
  const [inputState, setInputState] = useState({ title: "", amount: "" });

  const submitHandler = (event) => {
    event.preventDefault();
    props.onAdd(inputState);
    setInputState({ title: "", amount: "" });
  };

  const handleChange = (e) => {
    const { value, id } = e.target;
    setInputState((prevState) => {
      return {
        ...prevState,
        [id]: value,
      };
    });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={inputState.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={inputState.amount}
              onChange={handleChange}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.isLoading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
