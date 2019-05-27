import React, { Component } from "react";
import { Table, Button, Form, Input, Modal, Icon } from "antd";
import axios from "axios";
import DropOption from "../components/DropOption";
import OrderTypeSearch from "../components/OrderTypeSearch";
import Auth from "../modules/Auth";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

const FormItem = Form.Item;

class OrderTypePage extends Component {
  state = {
    items: [],
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
    fetch("/order-types", { headers })
      .then(res => res.json())
      .then(data => {
        this.setState({ items: data.data, loading: false });
      })
      .catch(err => console.error(err));
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
      .get("/order-types", { headers })
      .then(res => {
        if (res.data) {
          this.setState({ items: res.data.data, loading: false });
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
        axios.post("/order-types", fieldsValue, { headers }).then(() => {
          form.resetFields();
          this.setState({ modalVisible: false });
          this.handleRefresh();
        });
      } else {
        axios.put("/order-types/" + id, fieldsValue, { headers }).then(() => {
          form.resetFields();
          this.setState({ modalVisible: false });
          this.handleRefresh();
        });
      }
    });
  };

  handleDelete = id => {
    axios.delete("/order-types/" + id, { headers }).then(() => {
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
        title: "Order Type",
        dataIndex: "name",
        key: "name"
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
    const { currentItem = {} } = this.state;
    const modalProps = {
      item: this.state.modalType === "create" ? {} : currentItem,
      visible: this.state.modalVisible,
      maskClosable: false,
      title:
        this.state.modalType === "create"
          ? "Create Payment Type"
          : "Update Payment Type",
      centered: true
    };
    const getModalContent = () => {
      return (
        <Form>
          <FormItem label="Order Type" hasFeedback {...this.formLayout}>
            {getFieldDecorator("name", {
              initialValue: currentItem.name,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input placeholder="Order type" />)}
          </FormItem>
        </Form>
      );
    };

    return (
      <div>
        <OrderTypeSearch
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

export default Form.create()(OrderTypePage);
