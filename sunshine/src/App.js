import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "antd/dist/antd.css";
//import logo from "./logo.svg";
//import './App.css';
import LoginLayoutRoute from "./layouts/LoginLayoutRoute";
import AppLayoutRoute from "./layouts/AppLayoutRoute";

import LoginPage from "./containers/LoginPage";
import DashboardPage from "./containers/dashboard";
import RolePage from "./containers/RolePage";
import UserPage from "./containers/UserPage";
import OutstandingsReportPage from "./containers/OutstandingsReportPage";
import AgingReportPage from "./containers/AgingReportPage";
//import PaymentTypePage from "./containers/PaymentTypePage";
//import OrderTypePage from "./containers/OrderTypePage";
//import ServiceTypePage from "./containers/ServiceTypePage";
//import ReturnTypePage from "./containers/ReturnTypePage";
import UnitPricePage from "./containers/UnitPricePage";
import ItemPage from "./containers/ItemPage";
import WashingFactoryPage from "./containers/WashingFactoryPage";
import CustomerPage from "./containers/CustomerPage";
import OrderPage from "./containers/OrderPage";
import OrderAddEditPage from "./containers/OrderAddEditPage";
import OrderDetailsPage from "./containers/OrderDetailsPage";
import OrderItemPage from "./containers/OrderItemPage";
import BranchPage from "./containers/BranchPage";

import "./App.css";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Redirect to="/dashboard" />
          </Route>

          <LoginLayoutRoute path="/login" component={LoginPage} />

          <AppLayoutRoute path="/dashboard" component={DashboardPage} />
          <AppLayoutRoute
            path="/report/outstandings"
            component={OutstandingsReportPage}
          />
          <AppLayoutRoute path="/report/aging" component={AgingReportPage} />
          {/* <AppLayoutRoute path="/payment-types" component={PaymentTypePage} /> */}
          {/* <AppLayoutRoute path="/order-types" component={OrderTypePage} /> */}
          {/* <AppLayoutRoute path="/service-types" component={ServiceTypePage} /> */}
          {/* <AppLayoutRoute path="/return-types" component={ReturnTypePage} /> */}
          <AppLayoutRoute path="/unit-prices" component={UnitPricePage} />
          <AppLayoutRoute path="/roles" component={RolePage} />
          <AppLayoutRoute path="/users" component={UserPage} />
          <AppLayoutRoute path="/items" component={ItemPage} />
          <AppLayoutRoute
            path="/washing-factories"
            component={WashingFactoryPage}
          />
          <AppLayoutRoute path="/branches" component={BranchPage} />
          <AppLayoutRoute path="/customers" component={CustomerPage} />
          <AppLayoutRoute
            path="/orders/add/:customerId"
            component={OrderAddEditPage}
          />
          <AppLayoutRoute path="/orders/add" component={OrderAddEditPage} />
          <AppLayoutRoute path="/orders/list" component={OrderPage} />
          <AppLayoutRoute path="/orders/view" component={OrderDetailsPage} />
          <AppLayoutRoute path="/orders/items" component={OrderItemPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
