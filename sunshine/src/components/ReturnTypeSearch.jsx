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

class ReturnTypeSearch extends Component {
  handleSearch = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.props.showSearchLoading(true);
      fetch("/return-types/filter", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(fieldsValue)
      })
        .then(res => res.json())
        .then(data => {
          this.props.onSearchResults(data.data);
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
            {getFieldDecorator("name")(
              <Search placeholder="Search Return type" />
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

export default Form.create()(ReturnTypeSearch);
