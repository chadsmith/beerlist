import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  beer: {
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  text: {
    color: '#333',
    fontSize: 16,
  },
  quantity: {
    paddingTop: 2,
    paddingRight: 12,
    paddingBottom: 2,
    paddingLeft: 12,
    backgroundColor: '#eee',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderRadius: 14,
  },
  tried: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 20,
    width: 20,
  },
  banner: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderTopWidth: 0,
    borderRightWidth: 20,
    borderBottomWidth: 20,
    borderLeftWidth: 0,
    borderTopColor: 'transparent',
    borderRightColor: '#ffd82f',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

const Beer = ({ beer, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.beer}>
      <Image
        resizeMode="contain"
        source={{ uri: beer.label }}
        style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.text}>{beer.name}</Text>
        <Text style={styles.text}>{beer.brewery}</Text>
      </View>
      {typeof beer.quantity !== 'undefined' && (
        <View style={styles.quantity}>
          <Text style={styles.count}>{beer.quantity}</Text>
        </View>
      )}
      {beer.tried && (
        <View style={styles.tried}>
          <View style={styles.banner} />
          <MaterialIcons
            name="star"
            color="#fff"
            size={10}
            style={styles.icon} />
        </View>
      )}
    </View>
  </TouchableOpacity>
);

export default Beer;
