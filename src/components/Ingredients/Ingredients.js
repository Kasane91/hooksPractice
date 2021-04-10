import React, { useCallback, useReducer, useMemo, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import useHttp from "../../hooks/http";

import ErrorModal from "../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "REMOVE":
      return currentIngredients.filter(
        (ingredient) => ingredient.id !== action.id
      );
    default:
      throw new Error("Should not get there");
  }
};

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    identifier,
    clearError,
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && identifier === "REMOVE_INGREDIENT") {
      dispatch({ type: "REMOVE", id: reqExtra });
    } else if (!isLoading && !error && identifier === "ADD_INGREDIENT") {
      dispatch({ type: "ADD", ingredient: { id: data.name, ...reqExtra } });
    }
  }, [data, reqExtra, identifier, isLoading, error]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({
      type: "SET",
      ingredients: filteredIngredients,
    });
  }, []);

  const addIngredientHandler = useCallback(
    (ingredient) => {
      const url = `https://hookspractice-868d9-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json`;
      const method = "POST";
      const body = JSON.stringify(ingredient);
      sendRequest(url, method, body, ingredient, "ADD_INGREDIENT");
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    (id) => {
      const url = `https://hookspractice-868d9-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${id}.json`;
      const method = "DELETE";
      sendRequest(url, method, null, id, "REMOVE_INGREDIENT");
    },
    [sendRequest]
  );

  let ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  const onError = () => {
    clearError();
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={onError}>{error}</ErrorModal>}
      <IngredientForm onAdd={addIngredientHandler} isLoading={isLoading} />

      <section>
        <Search filter={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
