import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Untappd from '../lib/Untappd';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  search: {
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
  input: {
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

class Search extends Component {

  static navigationOptions = () => ({
    headerBackTitle: null,
    title: 'Add Beer',
  });

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillUnmount() {
    clearTimeout(this._timeout);
  }

  _delayedSearch = (search) => {
    clearTimeout(this._timeout);
    this._timeout = setTimeout(this._search, 500);
    this.setState({ search });
  }

  _search = () => {
    const { search } = this.state;
    clearTimeout(this._timeout);
    Untappd(search).then(results => this.setState({
      endReached: !results.length,
      results,
    }));
  }

  _renderItem = ({ item: beer }) => (
    <TouchableOpacity onPress={() => this._addBeer(beer)}>
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

  _onEndReached = () => {
    const { loading, endReached, results = [], search } = this.state;
    if(search && !(loading || endReached))
      this.setState({ loading: true }, () =>
        Untappd(search, results.length).then(data =>
          this.setState({
            loading: false,
            endReached: !data.length,
            results: [
              ...results,
              ...data,
            ],
          })
        )
      );
  }

  _addBeer = beer =>
    this.props.navigation.navigate('Beer', { beer });

  render() {
    const { results, search } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.search}>
          <TextInput
            autoFocus
            onChangeText={this._delayedSearch}
            onSubmitEditing={this._search}
            placeholder="Beer Name"
            style={styles.input}
            underlineColorAndroid="transparent"
            value={search} />
          <TouchableOpacity onPress={this._search}>
            <MaterialIcons
              name="search"
              size={24} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          onEndReached={this._onEndReached}
          renderItem={this._renderItem}
          style={styles.list} />
      </View>
    );
  }

}

export default Search;
