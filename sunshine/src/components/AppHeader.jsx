import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Menu } from "antd";
import Auth from "../modules/Auth";

const SubMenu = Menu.SubMenu;

const AppHeader = withRouter(({ history }) => (
  <Menu
    key="user"
    mode="horizontal"
    onClick={() => {
      Auth.deauthenticateUser();
      history.push("/");
    }}
  >
    <SubMenu
      title={
        <Fragment>
          <span style={{ color: "#999", marginRight: 4 }}>Hi: </span>
          <span>{Auth.getProfile().user_name}</span>
        </Fragment>
      }
    >
      <Menu.Item key="SignOut">
        <span>Sign out</span>
      </Menu.Item>
    </SubMenu>
  </Menu>
));

export default AppHeader;
