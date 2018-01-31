import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { search } from '../modules/api';

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

  componentWillReceiveProps({ ids }) {
    const { results = [] } = this.state;
    if(this.props.ids !== ids)
      this.setState({ results: [ ...results ] });
  }

  componentWillUnmount() {
    clearTimeout(this._timeout);
  }

  _delayedSearch = (query) => {
    clearTimeout(this._timeout);
    this._timeout = setTimeout(this._search, 500);
    this.setState({ query });
  }

  _search = () => {
    const { query } = this.state;
    clearTimeout(this._timeout);
    this.props.search(query).then(results => this.setState({
      endReached: !results.length,
      results,
    }));
  }

  _renderItem = ({ item: beer }) => {
    const { ids } = this.props;
    return (
      <TouchableOpacity onPress={() => this._addBeer(beer)}>
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
            name={ids.includes(beer.id) ? 'check' : 'chevron-right'}
            size={24} />
        </View>
      </TouchableOpacity>
    );
  }

  _onEndReached = () => {
    const { loading, endReached, results = [], query } = this.state;
    if(query && !(loading || endReached))
      this.setState({ loading: true }, () =>
        this.props.search(query, results.length).then(data =>
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
    const { results, query } = this.state;
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
            value={query} />
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

const mapDispatchToProps = dispatch => bindActionCreators({
  search,
}, dispatch);

const mapStateToProps = state => ({
  ids: state.beer.ids,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
