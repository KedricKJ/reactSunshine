import React, { Component } from "react";
import { Table, Row, Col, Button, Form, Input, Modal, Icon } from "antd";
import axios from "axios";
import DropOption from "../components/DropOption";
import CustomerTypeSearch from "../components/CustomerTypeSearch";
//import Modal from "../containers/customerTypes/components/Modal";
import Auth from "../modules/Auth";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

const FormItem = Form.Item;

class CustomerTypePage extends Component {
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
    fetch("/customer-types", { headers })
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
      .get("/customer-types", { headers })
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
        axios.post("/customer-types", fieldsValue, { headers }).then(() => {
          form.resetFields();
          this.setState({ modalVisible: false });
          this.handleRefresh();
        });
      } else {
        axios
          .put("/customer-types/" + id, fieldsValue, { headers })
          .then(() => {
            form.resetFields();
            this.setState({ modalVisible: false });
            this.handleRefresh();
          });
      }
    });
  };

  handleDelete = id => {
    axios.delete("/customer-types/" + id, { headers }).then(() => {
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

  /* handleSearch = () => {
    const { form } = this.props;
    const { getFieldsValue } = form;

    let fields = getFieldsValue();
    console.log("Search Values: ", fields);
    this.setState({ loading: true });
    fetch("/customer-types/filter", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(fields.search)
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ items: data.data, loading: false });
      })
      .catch(error => console.error(error));
  }; */

  /* handleReset = () => {
    const { form } = this.props;
    const { getFieldsValue, setFieldsValue } = form;

    let fields = getFieldsValue();
    fields.search = { name: "" };
    for (let item in fields.search) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = [];
        } else {
          fields[item] = undefined;
        }
      }
    }
    console.log("Reset Val: ", fields);
    setFieldsValue(fields);
    this.handleSearch();
  }; */

  handleAddItem = () => {
    this.setState({ modalVisible: true });
  };

  render() {
    const columns = [
      {
        title: "Customer Type",
        dataIndex: "name",
        key: "listName"
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
          ? "Create Customer Type"
          : "Update Customer Type",
      centered: true
    };
    const getModalContent = () => {
      return (
        <Form>
          <FormItem
            label="Customer Type"
            hasFeedback
            {...this.formLayout}
            key="formName"
          >
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true
                }
              ]
            })(<Input placeholder="Customer type" />)}
          </FormItem>
        </Form>
      );
    };

    return (
      <div>
        <CustomerTypeSearch
          showSearchLoading={this.showSearchLoading}
          onSearchResults={this.handleSearchResults}
          onAddItem={this.handleAddItem}
        />
        {/* <Button
          type="primary"
          style={{ marginBottom: 15, marginTop: 15 }}
          onClick={this.showModal}
        >
          <Icon type="plus" />
          Create
        </Button> */}
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

export default Form.create()(CustomerTypePage);
