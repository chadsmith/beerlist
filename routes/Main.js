import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { resetStack } from '../modules/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  item: {
    paddingTop: 15,
    paddingRight: 10,
    paddingBottom: 15,
    paddingLeft: 10,
    marginBottom: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    height: 36,
    width: 36,
    marginRight: 10,
  },
  text: {
    color: '#333',
    fontSize: 16,
  },
  tried: {
    marginLeft: 5,
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
      <TouchableOpacity onPress={() => navigation.navigate('Beer', { beer, index })}>
        <View style={styles.item}>
          <Image
            resizeMode="contain"
            source={{ uri: beer.label }}
            style={styles.image} />
          <View style={{ flex: 1 }}>
            <Text style={styles.text}>
              {beer.name}
              {beer.tried && (
                <MaterialIcons
                  name="star"
                  size={14}
                  color="#ffd82f"
                  style={styles.tried} />
              )}
            </Text>
            <Text style={styles.text}>{beer.brewery}</Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={24} />
        </View>
      </TouchableOpacity>
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
