const initialState = {
  list: [],
};

export default (state = initialState, action) => {
  let { index = state.list.length } = action;
  switch(action.type) {
    case 'ADD_BEER':
      if(typeof action.index === 'undefined')
        for(let i = 0; i < index; i += 1)
          if(state.list[i].id === action.beer.id) {
            index = i;
            break;
          }
      return {
        ...state,
        list: [
          ...state.list.slice(0, index),
          {
            ...state.list[index],
            ...action.beer,
            quantity: ((state.list[index] || {}).quantity || 0) + 1,
          },
          ...state.list.slice(index + 1),
        ],
      };
    case 'REMOVE_BEER':
      if(typeof action.index === 'undefined')
        for(let i = 0; i < index; i += 1)
          if(state.list[i].id === action.beer.id) {
            index = i;
            break;
          }
      return {
        ...state,
        list: [
          ...state.list.slice(0, index),
          ...(state.list[index].quantity > 0 ? [
            {
              ...state.list[index],
              ...action.beer,
              quantity: state.list[index].quantity - 1,
            },
          ] : []),
          ...state.list.slice(index + 1),
        ],
      };
    default:
      return state;
  }
};
