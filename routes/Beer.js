import React, { Component } from 'react';
import { Platform, Image, Linking, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { EventEmitter } from 'events';

import ActionButton from 'react-native-action-button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { addBeer, removeBeer } from '../modules/beer';

const emitter = new EventEmitter();

const AddButton = ({ beer }) => (
  <TouchableOpacity onPress={() => emitter.emit('button', { type: 'ADD_BEER', beer })}>
    <MaterialIcons
      name="add"
      size={32}
      style={{
        color: Platform.OS === 'ios' ? '#037aff' : '#000',
        marginRight: 8,
      }} />
  </TouchableOpacity>
);

const DeleteButton = ({ beer, index }) => (
  <TouchableOpacity onPress={() => emitter.emit('button', {
    type: 'REMOVE_BEER',
    beer,
    index,
  })}>
    <MaterialIcons
      name="delete"
      size={26}
      style={{
        color: Platform.OS === 'ios' ? '#037aff' : '#000',
        marginRight: 8,
      }} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  image: {
    width: 64,
    height: 64,
  },
  brewery: {
    marginTop: 10,
    fontSize: 16,
  },
  style: {
    marginTop: 10,
    fontSize: 14,
  },
  stats: {
    marginTop: 5,
    fontSize: 14,
  },
  quantity: {
    marginTop: 15,
    fontSize: 14,
  }
});

class Beer extends Component {

  static navigationOptions = ({ navigation }) => {
    const { beer, index } = navigation.state.params;
    let headerRight = null;
    if(index < 0)
      headerRight = (
        <AddButton beer={beer} />
      );
    else if(beer.quantity === 0)
      headerRight = (
        <DeleteButton
          beer={beer}
          index={index} />
      );
    return {
      title: beer.name,
      headerRight,
    };
  };

  componentWillMount() {
    emitter.addListener('button', this._onButton);
  }

  componentWillReceiveProps(nextProps) {
    const { beers: lastBeers, navigation } = this.props;
    const { beer, index } = navigation.state.params;
    const { beers } = nextProps;
    if(lastBeers !== beers) {
      if(index > -1)
        navigation.setParams({ beer: beers[index] });
      else
        for(let i = 0; i < beers.length; i += 1)
          if(beers[i].id === beer.id) {
            navigation.setParams({ beer: beers[i], index: i });
            break;
          }
    }
  }

  componentWillUnmount() {
    emitter.removeListener('button', this._onButton);
  }

  _onButton = (data) => {
    const { emit, navigation } = this.props;
    switch(data.type) {
      case 'REMOVE_BEER':
        navigation.goBack();
        break;
      default:
        break;
    }
    emit(data);
  }

  _onPress = () => {
    const { id } = this.props.navigation.state.params.beer;
    const uri = `untappd://beer/${id}`;
    Linking.canOpenURL(uri).then((supported) => {
      if(supported)
        Linking.openURL(uri);
      else
        Linking.openURL(`https://untappd.com/beer/${id}`);
    });
  }

  render() {
    const { addBeer, navigation, removeBeer } = this.props;
    const { index, beer } = navigation.state.params;
    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={this._onPress}>
            <Image
              resizeMode="contain"
              source={{ uri: beer.label }}
              style={styles.image} />
          </TouchableOpacity>
          <Text style={styles.brewery}>{beer.brewery}</Text>
          <Text style={styles.style}>{beer.style}</Text>
          <Text style={styles.stats}>
            {!!beer.abv && (
              <Text style={styles.abv}>{beer.abv}% ABV</Text>
            )}
            {!!(beer.abv && beer.ibu) && ' • '}
            {!!beer.ibu && (
              <Text style={styles.ibu}>{beer.ibu} IBU</Text>
            )}
          </Text>
          {typeof beer.quantity !== 'undefined' && (
            <Text style={styles.quantity}>Quantity: {beer.quantity}</Text>
          )}
        </View>
        {beer.quantity > 0 && (
          <ActionButton
            buttonColor="#20a8ff"
            renderIcon={() => (
              <MaterialCommunityIcons
                name="glass-mug"
                size={26}
                color="#fff" />
            )}>
            <ActionButton.Item
              buttonColor="#ff4330"
              onPress={() => removeBeer({ beer, index })}>
              <MaterialIcons
                name="remove"
                size={26}
                color="#fff" />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#ffd82f"
              onPress={() => addBeer({ beer, index })}>
              <MaterialIcons
                name="add"
                size={26}
                color="#fff" />
            </ActionButton.Item>
          </ActionButton>
        )}
        {index > -1 && !beer.quantity && (
          <ActionButton
            buttonColor="#ffd82f"
            onPress={() => addBeer({ beer })} />
        )}
      </View>
    );
  }

}

const mapDispatchToProps = dispatch => bindActionCreators({
  addBeer,
  emit: action => action,
  removeBeer,
}, dispatch);

const mapStateToProps = state => ({
  beers: state.beer.list,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Beer);
