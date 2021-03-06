import React, { Component } from 'react';
import { FlatList, Platform, RefreshControl, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { EventEmitter } from 'events';

import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Beer, Header } from '../components';
import { getBeer } from '../modules/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

const SORT = {
  default: {
    sort: beers => beers.sort((b1, b2) => b2.quantity - b1.quantity || b1.name.localeCompare(b2.name)),
  },
  brewery: {
    sectionHeader: beer => beer.brewery,
    sort: beers => beers.sort((b1, b2) => b1.brewery.localeCompare(b2.brewery) || b1.name.localeCompare(b2.name)),
  },
  style: {
    sectionHeader: beer => beer.style,
    sort: beers => beers.sort((b1, b2) => b1.style.localeCompare(b2.style) || b1.name.localeCompare(b2.name)),
  },
  abv: {
    sectionHeader: beer => (beer.abv ? `${beer.abv | 0}% ABV` : 'Unknown'),
    sort: beers => beers.sort((b1, b2) => b2.abv - b1.abv || b1.name.localeCompare(b2.name)),
    titleSort: (t1, t2) => parseFloat(t2) - parseFloat(t1),
  },
  ibu: {
    sectionHeader: beer => (beer.ibu ? `${Math.round(beer.ibu / 5) * 5} IBU` : 'Unknown'),
    sort: beers => beers.sort((b1, b2) => b1.ibu - b2.ibu || b1.name.localeCompare(b2.name)),
    titleSort: (t1, t2) => parseFloat(t1) - parseFloat(t2),
  }
};

const emitter = new EventEmitter();

const SortButton = () => (
  <TouchableOpacity onPress={() => emitter.emit('button')}>
    <MaterialIcons
      name="sort"
      size={32}
      style={{
        color: Platform.OS === 'ios' ? '#037aff' : '#000',
        marginRight: 8,
      }} />
  </TouchableOpacity>
);

class Main extends Component {

  static navigationOptions = ({
    headerBackTitle: null,
    headerRight: (
      <SortButton />
    ),
    title: 'Beer List',
  });

  state = {}

  componentDidMount() {
    const { loggedIn, navigation } = this.props;
    emitter.addListener('button', this._onButton);
    if(!loggedIn)
      navigation.navigate('Login');
  }

  componentWillUnmount() {
    emitter.removeListener('button', this._onButton);
  }

  _onButton = () => {
    const { sort, sortBy } = this.props;
    const sorts = Object.keys(SORT);
    sortBy(sorts[sorts.indexOf(sort) + 1] || 'default');
  }

  _onRefresh = () => {
    const { getBeer, list } = this.props;
    this.setState({ refreshing: true }, () =>
      Promise.all(
        Object.values(list).map(getBeer)
      )
        .then(() => this.setState({ refreshing: false }))
    );
  }

  _renderItem = ({ item: beer }) => (
    <Beer
      beer={beer}
      onPress={() => this.props.navigation.navigate('Beer', { beer })} />
  );

  _renderSectionHeader = ({ section }) => (
    <Header {...section} />
  );

  _renderTotalQuantity = () => {
    const beers = Object.values(this.props.list);
    const total = beers.reduce((subtotal, { quantity }) => subtotal + quantity, 0);
    const title = `${total} beer${title === 1 ? '' : 's'}`;
    return (
      <Header title={title} />
    );
  }

  _renderBeers(beers) {
    const { sort: method } = this.props;
    const { sectionHeader, sort, titleSort } = SORT[method];
    const ListComponent = sectionHeader ? SectionList : FlatList;
    return (
      <ListComponent
        data={sort(beers)}
        keyExtractor={({ id }) => id.toString()}
        ListHeaderComponent={sectionHeader ? undefined : this._renderTotalQuantity}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh} />
        }
        renderItem={this._renderItem}
        renderSectionHeader={sectionHeader ? this._renderSectionHeader : undefined}
        sections={sectionHeader ? Object.values(beers.reduce((sections, beer) => {
          // TODO - make this more efficient
          const title = sectionHeader(beer);
          const section = sections[title] || { title, data: [] };
          return Object.assign(sections, {
            [title]: {
              ...section,
              data: [
                ...section.data,
                beer,
              ],
            }
          });
        }, {})).sort(titleSort || ((s1, s2) => s1.title.localeCompare(s2.title))) : undefined}
        style={styles.list} />
    );
  }

  render() {
    const { list, navigation } = this.props;
    const beers = Object.values(list);
    const empty = beers.length === 0;
    return (
      <View style={styles.container}>
        {empty && (
          <Text style={styles.noBeer}>
            Your beer list is empty.
          </Text>
        )}
        {!empty && this._renderBeers(beers)}
        <ActionButton
          buttonColor="#20a8ff"
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

const mapDispatchToProps = dispatch => bindActionCreators({
  getBeer,
  sortBy: sort => ({ type: 'SORT', sort }),
}, dispatch);

const mapStateToProps = state => ({
  list: state.beer.list,
  loggedIn: !!state.api.token,
  sort: state.beer.sort || 'default',
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
