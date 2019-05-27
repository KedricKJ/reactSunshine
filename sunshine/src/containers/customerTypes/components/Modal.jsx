import React, { Component } from "react";
import { Form, Input, Modal } from "antd";

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
};

class CustomerTypeModal extends Component {
  state = {};

  handleOk = () => {
    const { form, onOk, item = {} } = this.props;
    const { validateFields, getFieldsValue } = form;
    validateFields(errors => {
      if (errors) return;
      const data = {
        ...getFieldsValue,
        key: item.key
      };
      onOk(data);
    });
  };

  render() {
    const { form, item = {}, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form layout="horizontal">
          <FormItem label="Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator("name", {
              initialValue: item.name,
              rules: [
                {
                  retuired: true
                }
              ]
            })(<Input placeholder="Customer type" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(CustomerTypeModal);
