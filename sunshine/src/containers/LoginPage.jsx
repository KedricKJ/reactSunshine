import React, { Component, Fragment } from "react";
import { Button, Row, Form, Input } from "antd";
import { Redirect } from "react-router-dom";
import axios from "axios";

import Footer from "../components/Footer";
import Auth from "../modules/Auth";

import logo from "../logo.jpg";
import "./Login.css";

const FormItem = Form.Item;

class LoginPage extends Component {
  state = {
    redirectToReferrer: false
  };

  handleOk = () => {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      axios
        .post(
          "http://34.245.83.48:10001/oauth/token",
          `grant_type=password&username=${values.username}&password=${
            values.password
          }`,
          {
            auth: { username: "SL", password: "Sl43&$^fdgd*+!!@#Agdo4Ged" }
          }
        )
        .then(res => {
          if (res.data) {
            console.log("Auth data: ", res.data);
            Auth.setToken(res.data.access_token);
            this.setState({ redirectToReferrer: true });
          }
        })
        .catch(err => console.log("Error: ", err));
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) return <Redirect to={from} />;

    return (
      <Fragment>
        <div className="LoginForm">
          <div className="LoginForm-logo">
            <img alt="logo" src={logo} style={{ width: 60 }} />
            <span>Sunshine Admin</span>
          </div>
          <form>
            <FormItem hasFeedback>
              {getFieldDecorator("username", {
                rules: [{ required: true }]
              })(<Input onPressEnter={this.handleOk} placeholder="Username" />)}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator("password", {
                rules: [{ required: true }]
              })(
                <Input
                  type="password"
                  onPressEnter={this.handleOk}
                  placeholder="Password"
                />
              )}
            </FormItem>
            <Row>
              <Button type="primary" onClick={this.handleOk}>
                Sign in
              </Button>
            </Row>
          </form>
        </div>
        <div className="footer">
          <Footer />
        </div>
      </Fragment>
    );
  }
}

export default Form.create()(LoginPage);
