import React, { Component } from "react";
import { Form, Row, Col, Input, Button } from "antd";
import Auth from "../modules/Auth";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

const { Search } = Input;

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16
  }
};

const TwoColProps = {
  ...ColProps,
  xl: 96
};

class CustomerSearch extends Component {
  handleSearch = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.props.showSearchLoading(true);
      let searchParamId = fieldsValue.mobile
        ? encodeURIComponent(searchParamId)
        : "";
      fetch(`/customers?mobile=${searchParamId}`, {
        method: "GET",
        headers: headers
      })
        .then(res => res.json())
        .then(data => {
          this.props.onSearchResults(data.content);
        })
        .catch(error => console.error(error));
    });
  };

  handleReset = e => {
    this.props.form.resetFields();
    this.handleSearch(e);
  };

  render() {
    const { form, onAddItem } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={24}>
          <Col xl={{ span: 4 }} md={{ span: 12 }}>
            {getFieldDecorator("mobile")(
              <Search placeholder="Search mobile" />
            )}
          </Col>
          <Col {...TwoColProps} xl={{ span: 20 }} md={{ span: 12 }}>
            <Row type="flex" align="middle" justify="space-between">
              <div>
                <Button
                  type="primary"
                  className="margin-right"
                  onClick={this.handleSearch}
                >
                  Search
                </Button>
                <Button onClick={this.handleReset}>Reset</Button>
              </div>
              <Button type="dashed" onClick={onAddItem}>
                Create
              </Button>
            </Row>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(CustomerSearch);
