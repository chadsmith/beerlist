import React, { Component } from 'react';
import { FlatList, Platform, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { EventEmitter } from 'events';

import ActionButton from 'react-native-action-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Beer, Header } from '../components';
import { resetStack } from '../modules/api';

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
    sort: beers => beers,
  },
  quantity: {
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
    sort: beers => beers.sort((b1, b2) => b1.abv - b2.abv || b1.name.localeCompare(b2.name)),
  },
  ibu: {
    sectionHeader: beer => (beer.ibu ? `${(Math.round(beer.ibu / 10) - 1) * 10} IBU` : 'Unknown'),
    sort: beers => beers.sort((b1, b2) => b1.ibu - b2.ibu || b1.name.localeCompare(b2.name)),
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

  componentWillMount() {
    const { loggedIn, navigation } = this.props;
    emitter.addListener('button', this._onButton);
    if(!loggedIn)
      navigation.dispatch(resetStack('Login'));
  }

  componentWillUnmount() {
    emitter.removeListener('button', this._onButton);
  }

  _onButton = () => {
    const { sort, sortBy } = this.props;
    const sorts = Object.keys(SORT);
    sortBy(sorts[sorts.indexOf(sort) + 1] || 'default');
  }

  _renderItem = ({ item: beer, index }) => (
    <Beer
      beer={beer}
      onPress={() => this.props.navigation.navigate('Beer', { beer, index })} />
  );

  _renderSectionHeader = ({ section }) => (
    <Header {...section} />
  );

  _renderBeers() {
    const { beers, sort: method } = this.props;
    const { sectionHeader, sort } = SORT[method];
    const ListComponent = sectionHeader ? SectionList : FlatList;
    if(!beers.length)
      return null;
    return (
      <ListComponent
        data={sort(beers)}
        keyExtractor={item => item.id}
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
        }, {})).sort((s1, s2) => s1.title.localeCompare(s2.title)) : undefined}
        style={styles.list} />
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
        {this._renderBeers()}
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

const mapDispatchToProps = dispatch => bindActionCreators({
  sortBy: sort => ({ type: 'SORT', sort }),
}, dispatch);

const mapStateToProps = state => ({
  beers: state.beer.list,
  loggedIn: !!state.api.token,
  sort: state.beer.sort || 'default',
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
