import React, { Component } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Beer } from '../components';
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

  componentWillReceiveProps({ beers }) {
    const { results = [] } = this.state;
    if(this.props.beers !== beers)
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

  _clear = () =>
    this.setState({
      query: null,
      results: null,
    });

  _search = () => {
    const { query } = this.state;
    clearTimeout(this._timeout);
    this.props.search(query).then(results => this.setState({
      endReached: !results.length,
      results,
    }));
  }

  _renderItem = ({ item }) => {
    const { ids, beers, navigation } = this.props;
    const index = ids.indexOf(item.id);
    const beer = {
      ...beers[index],
      ...item,
    };
    return (
      <Beer
        beer={beer}
        onPress={() => navigation.navigate('Beer', { beer, index })} />
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
          {!!results && (
            <TouchableOpacity onPress={this._clear}>
              <MaterialIcons
                name="clear"
                size={24} />
            </TouchableOpacity>
          )}
          {!results && (
            <TouchableOpacity onPress={this._search}>
              <MaterialIcons
                name="search"
                size={24} />
            </TouchableOpacity>
          )}
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
  beers: state.beer.list,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
