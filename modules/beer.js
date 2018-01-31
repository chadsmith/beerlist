export const addBeer = ({ beer, index }) =>
  dispatch => dispatch({
    type: 'ADD_BEER',
    beer,
    index,
  });

export const removeBeer = ({ beer, index }) =>
  dispatch => dispatch({
    type: 'REMOVE_BEER',
    beer,
    index,
  });
