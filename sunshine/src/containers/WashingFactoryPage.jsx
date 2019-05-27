import React, { Component } from "react";
import { Table, Form, Input, Modal, Icon, Breadcrumb } from "antd";
import axios from "axios";
import DropOption from "../components/DropOption";
import WashingFactorySearch from "../components/WashingFactorySearch";
import Auth from "../modules/Auth";
import Page from "../components/Page";
let headers = { "Content-Type": "application/json" };
if (Auth.getToken()) {
  headers["Authorization"] = `Bearer ${Auth.getToken()}`;
}

const FormItem = Form.Item;

class WashingFactoryPage extends Component {
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
    fetch("/factories", { headers })
      .then(res => res.json())
      .then(data => {
        this.setState({ items: data.content, loading: false });
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
      .get("/factories", { headers })
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
    const id = currentItem ? currentItem.id : "";

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if (!id) {
        axios.post("/factories", fieldsValue, { headers }).then(() => {
          form.resetFields();
          this.setState({ modalVisible: false });
          this.handleRefresh();
        });
      } else {
        axios.put("/factories/" + id, fieldsValue, { headers }).then(() => {
          form.resetFields();
          this.setState({ modalVisible: false });
          this.handleRefresh();
        });
      }
    });
  };

  handleDelete = id => {
    axios.delete("/factories/" + id, { headers }).then(() => {
      this.handleRefresh();
    });
  };

  deleteItem = item => {
    Modal.confirm({
      title: "Delete factory",
      content: "Do you want to delete this factory?",
      onOk: () => this.handleDelete(item.id)
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
        title: "Factory Name",
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
        this.state.modalType === "create" ? "Create Factory" : "Update Factory",
      centered: true
    };
    const getModalContent = () => {
      return (
        <Form>
          <FormItem label="Factory Name" hasFeedback {...this.formLayout}>
            {getFieldDecorator("name", {
              initialValue: currentItem.name,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input placeholder="Factory Name" />)}
          </FormItem>
        </Form>
      );
    };

    return (
      <div>
        <Breadcrumb style={{ marginBottom: 24 }}>
          <Breadcrumb.Item href="/dashboard">
            <Icon type="dashboard" />
            <span>Dashboard</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Icon type="bank" />
            <span>Washing Factories</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Page inner>
          <WashingFactorySearch
            showSearchLoading={this.showSearchLoading}
            onSearchResults={this.handleSearchResults}
            onAddItem={this.handleAddItem}
          />
          <Table
            loading={this.state.loading}
            rowKey="id"
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
        </Page>
      </div>
    );
  }
}

export default Form.create()(WashingFactoryPage);
