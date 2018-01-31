import React, { Component } from 'react';
import { StyleSheet, View, WebView } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { login, LOGIN_URL, REDIRECT_URL, resetStack } from '../modules/api';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    backgroundColor: '#f5f2e8',
  },
  webview: {
    backgroundColor: '#f5f2e8',
  },
});

class Login extends Component {

  static navigationOptions = () => ({
    header: null,
  });

  componentWillReceiveProps(nextProps) {
    const { loggedIn, navigation } = nextProps;
    if(loggedIn)
      navigation.dispatch(resetStack('Main'));
  }

  _onNavigationStateChange = ({ url }) => {
    if(url.startsWith(REDIRECT_URL) && url.includes('access_token'))
      this.props.login(url);
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView
          style={styles.webview}
          source={{ uri: LOGIN_URL }}
          onNavigationStateChange={this._onNavigationStateChange}
          startInLoadingState={false} />
      </View>
    );
  }

}

const mapDispatchToProps = dispatch => bindActionCreators({
  login,
}, dispatch);

const mapStateToProps = state => ({
  loggedIn: !!state.api.token,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
