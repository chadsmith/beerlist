import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  header: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  text: {
    color: '#333',
    fontSize: 12,
  },
});

const Header = ({ title }) => (
  <View style={styles.header}>
    <Text style={styles.text}>{title}</Text>
  </View>
);

export default Header;
