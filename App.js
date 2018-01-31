import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';

import Beer from './routes/Beer';
import Login from './routes/Login';
import Main from './routes/Main';
import Search from './routes/Search';

import Reducers from './reducers';

const App = StackNavigator({
  Beer: {
    screen: Beer,
  },
  Login: {
    screen: Login,
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

const store = createStore(reducers, applyMiddleware(thunk));
const persistor = persistStore(store, null, () => store.getState());

export default () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
