import React, { Component } from 'react';
import { Platform, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { EventEmitter } from 'events';

import ActionButton from 'react-native-action-button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
});

class Beer extends Component {

  static navigationOptions = ({ navigation }) => {
    const { beer, index } = navigation.state.params;
    let headerRight = null;
    if(typeof index === 'undefined')
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
      if(typeof index !== 'undefined')
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

  render() {
    const { emit, navigation } = this.props;
    const { index, beer } = navigation.state.params;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>{JSON.stringify(beer)}</Text>
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
              onPress={() => emit({ type: 'REMOVE_BEER', beer, index })}>
              <MaterialIcons
                name="remove"
                size={26}
                color="#fff" />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#ffd82f"
              onPress={() => emit({ type: 'ADD_BEER', beer, index })}>
              <MaterialIcons
                name="add"
                size={26}
                color="#fff" />
            </ActionButton.Item>
          </ActionButton>
        )}
        {typeof index !== 'undefined' && !beer.quantity && (
          <ActionButton
            buttonColor="#ffd82f"
            onPress={() => emit({ type: 'ADD_BEER', beer })} />
        )}
      </ScrollView>
    );
  }

}

const mapDispatchToProps = dispatch => bindActionCreators({
  emit: action => action,
}, dispatch);

const mapStateToProps = state => ({
  beers: state.beer.list,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Beer);
