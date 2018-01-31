import React, { Component } from 'react';
import { WebView } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { login, LOGIN_URL, REDIRECT_URL, resetStack } from '../modules/api';

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
      <WebView
        source={{ uri: LOGIN_URL }}
        onNavigationStateChange={this._onNavigationStateChange}
        startInLoadingState={false} />
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
