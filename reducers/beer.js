const initialState = {
  ids: [],
  list: [],
  sort: 'default',
};

export default (state = initialState, action) => {
  const { beer } = action;
  switch(action.type) {
    case 'ADD_BEER': {
      const index = state.ids.indexOf(beer.id);
      if(index < 0)
        return {
          ...state,
          ids: [
            ...state.ids,
            beer.id,
          ],
          list: [
            ...state.list,
            {
              ...beer,
              quantity: beer.quantity || 1,
            },
          ],
        };
      return {
        ...state,
        list: [
          ...state.list.slice(0, index),
          {
            ...state.list[index],
            ...beer,
            quantity: (state.list[index].quantity || 0) + 1,
          },
          ...state.list.slice(index + 1),
        ],
      };
    }
    case 'REMOVE_BEER': {
      const index = state.ids.indexOf(beer.id);
      if(index > -1)
        return {
          ...state,
          ids: state.list[index].quantity > 0 ? state.ids : [
            ...state.ids.slice(0, index),
            ...state.ids.slice(index + 1),
          ],
          list: [
            ...state.list.slice(0, index),
            ...(state.list[index].quantity > 0 ? [
              {
                ...state.list[index],
                ...beer,
                quantity: state.list[index].quantity - 1,
              },
            ] : []),
            ...state.list.slice(index + 1),
          ],
        };
      break;
    }
    case 'SORT':
      return {
        ...state,
        sort: action.sort,
      };
    default:
      break;
  }
  return state;
};
