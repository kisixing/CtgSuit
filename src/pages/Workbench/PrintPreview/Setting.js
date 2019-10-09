import React, { Component } from 'react';
import { Form, Radio, InputNumber, Row, Col } from 'antd';
import styles from './index.less';

@Form.create()
class Setting extends Component {
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div className={styles.wrapper}>
      </div>
    );
  }
}

export default Setting;