const initialState = {
  list: {},
  sort: 'default',
};

export default (state = initialState, action) => {
  const { id, ...rest } = action.beer || {};
  const { quantity = 0 } = state.list[id] || {};
  switch(action.type) {
    case 'ADD_BEER':
      return {
        ...state,
        list: {
          ...state.list,
          [id]: {
            id,
            ...rest,
            quantity: quantity + 1,
          },
        },
      };
    case 'REMOVE_BEER': {
      const { id } = action.beer;
      const { quantity = 0, ...rest } = state.list[id] || {};
      if(quantity > 0)
        return {
          ...state,
          list: {
            ...state.list,
            [id]: {
              id,
              ...rest,
              quantity: quantity - 1,
            },
          }
        };
      const newList = Object.assign({}, state.list);
      delete newList[id];
      return {
        ...state,
        list: newList,
      };
    }
    case 'SORT':
      return {
        ...state,
        sort: action.sort,
      };
    default:
      return state;
  }
};
