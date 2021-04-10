import { useReducer, useCallback } from "react";

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "REQUEST":
      return {
        ...httpState,
        loading: true,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...httpState,
        loading: false,
        data: action.response,
        extra: action.extra,
      };
    case "ERROR":
      return { ...httpState, loading: false, error: action.error };

    case "CLEAR":
      return initialState;
    default:
      throw new Error("Should not be reached!");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clearError = useCallback(() => dispatchHttp({ type: "CLEAR" }), []);

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({ type: "REQUEST", identifier: reqIdentifier });
      fetch(url, {
        method: method,
        body: body,
        header: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseParsed) => {
          dispatchHttp({
            type: "RESPONSE",
            response: responseParsed,
            extra: reqExtra,
          });
        })
        .catch((error) => {
          dispatchHttp({
            type: "ERROR",
            error: "SOMETHING WENT WRONG",
          });
        });
    },
    []
  );

  return {
    isLoading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    identifier: httpState.identifier,
    clearError: clearError,
  };
};

export default useHttp;
