import React, { Component } from "react";
import { Form, Button, Icon, Table, Row, Col, Input, Drawer } from "antd";
import axios from "axios";
import Auth from "../modules/Auth";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

class ItemSearchAndAdd extends Component {
  state = {
    expand: false,
    searchResults: [],
    loading: false,
    search: false
  };

  getFields = () => {
    const { getFieldDecorator } = this.props.form;
    const children = [];
    children.push(
      <Col span={8} key="code">
        <Form.Item label="Code">
          {getFieldDecorator("code")(<Input placeholder="Code" />)}
        </Form.Item>
      </Col>
    );
    children.push(
      <Col span={8} key="name">
        <Form.Item label="Name">
          {getFieldDecorator("name")(<Input placeholder="name" />)}
        </Form.Item>
      </Col>
    );
    return children;
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true, search: true });
        axios.post("/items/filter", values, { headers }).then(res => {
          if (res.data) {
            this.setState({ searchResults: res.data.data, loading: false });
          }
        });
      }
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.setState({ searchResults: [] });
  };

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  handleItemClick = item => {
    this.props.onItemClick(item);
  };

  render() {
    const { onClose, visible, onAddItem } = this.props;

    const columns = [
      {
        title: "Item Name",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Operation",
        key: "operation",
        render: (text, record) => (
          <Button
            type="dashed"
            onClick={e => {
              e.stopPropagation();
              onAddItem(record);
            }}
          >
            <Icon type="plus" /> Add
          </Button>
        )
      }
    ];

    return (
      <Drawer
        title="Search and Add Item"
        width={720}
        onClose={onClose}
        visible={visible}
        style={{
          overflow: "auto",
          height: "calc(100% - 108px)",
          paddingBottom: "108px"
        }}
      >
        <Form
          name="search"
          className="ant-advanced-search-form"
          onSubmit={this.handleSubmit}
        >
          <Row gutter={24}>{this.getFields()}</Row>
          <Row>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                Clear
              </Button>
              <a style={{ marginLeft: 8, fontSize: 12 }} onClick={this.toggle}>
                Collapse <Icon type={this.state.expand ? "up" : "down"} />
              </a>
            </Col>
          </Row>
        </Form>
        {this.state.searchResults.length > 0 ? (
          <div className="search-result-list">
            <Table
              loading={this.state.loading}
              rowKey="_id"
              columns={columns}
              dataSource={this.state.searchResults}
            />
          </div>
        ) : (
          this.state.search && (
            <div className="search-result-empty-list">No items found.</div>
          )
        )}
      </Drawer>
    );
  }
}

export default Form.create()(ItemSearchAndAdd);
