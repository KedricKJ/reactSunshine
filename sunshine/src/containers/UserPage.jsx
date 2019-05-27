import React, { Component } from "react";
import { Table, Form, Input, Modal, Checkbox, Col, Row, Select } from "antd";
import axios from "axios";
import DropOption from "../components/DropOption";
import UserSearch from "../components/UserSearch";
import Auth from "../modules/Auth";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

const FormItem = Form.Item;
const Option = Select.Option;

class UserPage extends Component {
  state = {
    items: [],
    roles: [],
    branches: [],
    loading: true,
    modalVisible: false,
    modalType: "create",
    currentItem: {}
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 }
  };

  componentDidMount() {
    fetch("/users", { headers })
      .then(res => res.json())
      .then(data => {
        this.setState({ items: data.content, loading: false });
      })
      .catch(err => console.error(err));
    fetch("/roles/suggestions", { headers })
      .then(res => res.json())
      .then(data => {
        this.setState({ roles: data.content });
      });
    fetch("/branches", { headers })
      .then(res => res.json())
      .then(data => {
        this.setState({ branches: data.content });
      });
  }

  showModal = () => {
    this.setState({ modalVisible: true });
  };

  showEditModal = item => {
    this.setState({
      modalVisible: true,
      currentItem: item,
      modalType: "update"
    });
  };

  handleRefresh = () => {
    this.setState({ loading: true });
    axios
      .get("/users", { headers })
      .then(res => {
        if (res.data) {
          this.setState({ items: res.data.content, loading: false });
        }
      })
      .catch(err => console.log(err));
  };

  handleCancel = () => {
    this.setState({ modalVisible: false });
  };

  handleModalSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const { currentItem } = this.state;
    const id = currentItem ? currentItem._id : "";

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if (!id) {
        axios.post("/users", fieldsValue, { headers }).then(() => {
          form.resetFields();
          this.setState({ modalVisible: false });
          this.handleRefresh();
        });
      } else {
        axios.put(`/users/${id}`, fieldsValue, { headers }).then(() => {
          form.resetFields();
          this.setState({ modalVisible: false });
          this.handleRefresh();
        });
      }
    });
  };

  handleDelete = id => {
    axios.delete(`/users/${id}`, { headers }).then(() => {
      this.handleRefresh();
    });
  };

  deleteItem = item => {
    Modal.confirm({
      title: "Delete type",
      content: "Do you want to delete this type?",
      onOk: () => this.handleDelete(item._id)
    });
  };

  handleMenuClick = (record, e) => {
    if (e.key === "edit") {
      this.setState({ currentItem: record });
      this.showEditModal(record);
    } else if (e.key === "delete") {
      this.deleteItem(record);
    }
  };

  showSearchLoading = flag => {
    this.setState({ loading: flag });
  };

  handleSearchResults = results => {
    this.setState({ items: results, loading: false });
  };

  handleAddItem = () => {
    this.setState({ modalVisible: true });
  };

  render() {
    const columns = [
      {
        title: "User name",
        dataIndex: "username",
        key: "username"
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email"
      },
      {
        title: "Contact #",
        dataIndex: "contactNo",
        key: "contactNo"
      },
      {
        title: "Operation",
        key: "operation",
        render: (text, record) => (
          <DropOption
            onMenuClick={e => this.handleMenuClick(record, e)}
            menuOptions={[
              { key: "edit", name: "Edit" },
              { key: "delete", name: "Delete" }
            ]}
          />
        )
      }
    ];
    const { getFieldDecorator } = this.props.form;
    const { currentItem = {}, branches, roles } = this.state;
    let currentItemRoles = null;
    if (Object.entries(currentItem).length !== 0) {
      currentItemRoles = currentItem.roles.map(item => item.id);
    }
    const modalProps = {
      item: this.state.modalType === "create" ? {} : currentItem,
      visible: this.state.modalVisible,
      maskClosable: false,
      title: this.state.modalType === "create" ? "Create User" : "Update User",
      centered: true
    };
    const getModalContent = () => {
      return (
        <Form>
          <FormItem label="User name" hasFeedback {...this.formLayout}>
            {getFieldDecorator("username", {
              initialValue: currentItem.username,
              rules: [{ required: true }]
            })(<Input placeholder="User name" />)}
          </FormItem>
          <FormItem label="Email" hasFeedback {...this.formLayout}>
            {getFieldDecorator("email", {
              initialValue: currentItem.email,
              rules: [
                { type: "email", message: "The input is not valid E-mail" },
                { required: true }
              ]
            })(<Input placeholder="Email address" />)}
          </FormItem>
          <FormItem label="Password" hasFeedback {...this.formLayout}>
            {getFieldDecorator("password", {
              initialValue: currentItem.password,
              rules: [{ required: true }]
            })(<Input placeholder="Password" type="password" />)}
          </FormItem>
          <FormItem label="Roles" hasFeedback {...this.formLayout}>
            {getFieldDecorator("roles", {
              initialValue: currentItemRoles,
              rules: [
                {
                  required: true,
                  message: "At least one role is required"
                }
              ]
            })(
              <Checkbox.Group>
                <Row>
                  {roles.map(role => (
                    <Col span={24} key={role.id}>
                      <Checkbox value={role.id}>{role.name}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            )}
          </FormItem>
          <FormItem label="Branch" hasFeedback {...this.formLayout}>
            {getFieldDecorator(`branch`, {
              rules: [{ required: true, message: "Please select a branch" }]
            })(
              <Select placeholder="Please select">
                {branches.map(d => (
                  <Option key={d.id} value={d.id}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Form>
      );
    };

    return (
      <div>
        <UserSearch
          showSearchLoading={this.showSearchLoading}
          onSearchResults={this.handleSearchResults}
          onAddItem={this.handleAddItem}
        />
        <Table
          loading={this.state.loading}
          rowKey="_id"
          columns={columns}
          dataSource={this.state.items}
        />
        <Modal
          {...modalProps}
          onCancel={this.handleCancel}
          onOk={this.handleModalSubmit}
        >
          {getModalContent()}
        </Modal>
      </div>
    );
  }
}

export default Form.create()(UserPage);
