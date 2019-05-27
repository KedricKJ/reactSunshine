import React from "react";
import { Route } from "react-router-dom";
import LoginLayout from "./LoginLayout";

const LoginLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={matchProps => (
        <LoginLayout>
          <Component {...matchProps} />
        </LoginLayout>
      )}
    />
  );
};

export default LoginLayoutRoute;
