import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getUser } from '../util/AuthUtils';

export default class AuthRoute extends React.Component {
  render() {
    const { component, ...props } = this.props;
    const user = getUser();
    if (!user || !user.userid) {
      return <Redirect to={{ pathname: '/login' }} />;
    }
    if (component) {
      return <Route component={component} {...props} />;
    }
    return null;
  }
}
