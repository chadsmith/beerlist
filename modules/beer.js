export const addBeer = ({ beer }) =>
  dispatch => dispatch({
    type: 'ADD_BEER',
    beer,
  });

export const removeBeer = ({ beer }) =>
  dispatch => dispatch({
    type: 'REMOVE_BEER',
    beer,
  });
