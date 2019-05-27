import React from "react";
import { Route, Redirect } from "react-router-dom";
import AppLayout from "./AppLayout";
import Auth from "../modules/Auth";

const AppLayoutRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        Auth.loggedIn() ? (
          <AppLayout>
            <Component {...props} />
          </AppLayout>
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default AppLayoutRoute;
