import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import storage from 'redux-persist/lib/storage';

import Beer from './routes/Beer';
import Main from './routes/Main';
import Search from './routes/Search';

import Reducers from './reducers';

const App = StackNavigator({
  Beer: {
    screen: Beer,
  },
  Main: {
    screen: Main,
  },
  Search: {
    screen: Search,
  },
},
{
  initialRouteName: 'Main',
});

const reducers = combineReducers(
  Object.keys(Reducers).reduce((combined, key) =>
    Object.assign(combined, {
      [key]: persistReducer({
        key,
        storage,
      }, Reducers[key]),
    }),
  {}));

const store = createStore(reducers);
const persistor = persistStore(store, null, () => store.getState());

export default () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
