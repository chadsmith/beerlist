import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
  text: {
    color: '#333',
    fontSize: 16,
  },
});

class Main extends Component {

  static navigationOptions = () => ({
    header: null,
  });

  _renderItem = ({ item: beer, index }) => {
    const { navigation } = this.props;
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Beer', { beer, index })}>
        <View style={styles.item}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text}>{beer.name}</Text>
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
        <FlatList
          data={beers}
          keyExtractor={item => item.id}
          renderItem={this._renderItem}
          style={styles.list} />
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
});

export default connect(mapStateToProps)(Main);
