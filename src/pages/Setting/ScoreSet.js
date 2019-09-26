import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input } from 'antd';

import { formItemLayout } from './utils';
import styles from './style.less';

@Form.create()
class ScoreSet extends Component {
  render() {
    const {
      id,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form id={id} layout="horizontal" {...formItemLayout} className={styles.form}>
        <Form.Item>
          <div className={styles.subTitle}>评分设置</div>
        </Form.Item>
        <Form.Item label="评分">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input the title of collection!' }],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="标准">
          {getFieldDecorator('description')(<Input type="textarea" />)}
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ setting, loading }) => ({
  loading: loading,
}))(ScoreSet);
