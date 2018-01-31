import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Beer } from '../components';
import { resetStack } from '../modules/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  noBeer: {
    color: '#333',
    fontSize: 20,
    textAlign: 'center',
  },
});

class Main extends Component {

  static navigationOptions = () => ({
    header: null,
  });

  componentWillMount() {
    const { loggedIn, navigation } = this.props;
    if(!loggedIn)
      navigation.dispatch(resetStack('Login'));
  }

  _renderItem = ({ item: beer, index }) => {
    const { navigation } = this.props;
    return (
      <Beer
        beer={beer}
        onPress={() => navigation.navigate('Beer', { beer, index })} />
    );
  }

  render() {
    const { beers, navigation } = this.props;
    return (
      <View style={styles.container}>
        {!beers.length && (
          <Text style={styles.noBeer}>
            Your beer list is empty.
          </Text>
        )}
        {beers.length > 0 && (
          <FlatList
            data={beers}
            keyExtractor={item => item.id}
            renderItem={this._renderItem}
            style={styles.list} />
        )}
        <ActionButton
          buttonColor="rgba(231, 76, 60, 1)"
          onPress={() => navigation.navigate('Search')}
          renderIcon={() => (
            <MaterialIcons
              name="search"
              size={26}
              color="#fff" />
          )} />
      </View>
    );
  }

}

const mapStateToProps = state => ({
  beers: state.beer.list,
  loggedIn: !!state.api.token,
});

export default connect(mapStateToProps)(Main);
