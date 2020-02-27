import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Switch } from 'antd';


import { formItemLayout, tailFormItemLayout } from './utils';
import styles from './style.less';
import { connect } from 'dva';

@Form.create()
@connect(state => ({ layoutLock: state.setting.layoutLock }))
class LayoutSetting extends Component {
  componentDidMount() {
    this.fetchData()
  }
  fetchData = () => {
    const { form, layoutLock } = this.props;
    form.setFieldsValue({ layoutLock });

  }
  handleSubmit = () => {
    this.props.form.validateFields((err, { layoutLock }) => {
      if (!err) {
        this.props.dispatch({ type: 'setting/setState', payload: { layoutLock } })
      }
    });
  };




  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="horizontal" {...formItemLayout} className={styles.form}>
        <div className={styles.subTitle}>布局设置</div>
        <Form.Item label="窗口自动排列">
          {getFieldDecorator('layoutLock', {})(<Switch />)}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" onClick={this.handleSubmit}>
            保存
          </Button>

        </Form.Item>
      </Form>
    );
  }
}

export default LayoutSetting
