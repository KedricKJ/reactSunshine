import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Icon } from "antd";
import AppHeader from "../components/AppHeader";
//import Auth from "../modules/Auth";

import logo from "../logo.png";
import "./layout.scss";

const { Header, Sider, Content, Footer } = Layout;
const SubMenu = Menu.SubMenu;

class AppLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  render() {
    return (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          breakpoint="lg"
          width={256}
          theme="dark"
        >
          <div className="brand">
            <div className="logo" id="logo">
              <Link to="/">
                <img src={logo} alt="logo" />
                {this.state.collapsed ? null : <h1>Sunshine Admin</h1>}
              </Link>
            </div>
          </div>
          <div className="menuContainer">
            <Menu
              key="mainMenu"
              mode="inline"
              theme="dark"
              selectedKeys={[`${window.location.pathname}`]}
            >
              <Menu.Item key="/dashboard">
                <Link to="/dashboard">
                  <Icon type="dashboard" />
                  <span>Dashboard</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/customers">
                <Link to="/customers">
                  <Icon type="wechat" />
                  <span>Customers</span>
                </Link>
              </Menu.Item>
              <SubMenu
                key="orders"
                title={
                  <span>
                    <Icon type="shopping-cart" />
                    <span>Orders</span>
                  </span>
                }
              >
                <Menu.Item key="/orders/add">
                  <Link to="/orders/add">
                    <span>Create Order</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="/orders/list">
                  <Link to="/orders/list">
                    <span>Order List</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="/orders/items">
                  <Link to="/orders/items">
                    <span>Order Items</span>
                  </Link>
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="/unit-prices">
                <Link to="/unit-prices">
                  <Icon type="pound" />
                  <span>Unit Prices</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/items">
                <Link to="/items">
                  <Icon type="qrcode" />
                  <span>Items</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/branches">
                <Link to="/branches">
                  <Icon type="branches" />
                  <span>Branches</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/washing-factories">
                <Link to="/washing-factories">
                  <Icon type="bank" />
                  <span>Washing Factories</span>
                </Link>
              </Menu.Item>
              <SubMenu
                key="reports"
                title={
                  <span>
                    <Icon type="profile" />
                    <span>Reports</span>
                  </span>
                }
              >
                <Menu.Item key="/report/outstandings">
                  <Link to="/report/outstandings">
                    <span>Outstandings</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="/report/aging">
                  <Link to="/report/aging">
                    <span>Againg</span>
                  </Link>
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="/roles">
                <Link to="/roles">
                  <Icon type="lock" />
                  <span>Roles</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/users">
                <Link to="/users">
                  <Icon type="user" />
                  <span>Users</span>
                </Link>
              </Menu.Item>
            </Menu>
          </div>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }}>
            <div className="header">
              <span className="trigger">
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                  onClick={this.toggle}
                />
              </span>
              <div className="right">
                <AppHeader />
              </div>
            </div>
          </Header>
          <Content className="content">{this.props.children}</Content>
          <Footer className="footer">
            <div className="copyright">
              Sunshine Admin © 2019 Bottleneck Solutions
            </div>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default AppLayout;
