
import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Row, Col, Input, DatePicker, Button, message } from 'antd';

import styles from './index.less';

@Form.create()
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: {},
    };
  }

  // 检索
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { inpatientNO, name, edd } = values;
        if (inpatientNO === undefined && name === undefined && edd === undefined) {
          message.info('请输入检索条件');
          return;
        }
        this.props.dispatch({
          type: 'pregnancy/fetchPregnancies',
          payload: {
            'inpatientNO.contains': inpatientNO,
            'name.contains': name,
            'edd.equals': edd ? moment(edd).format('YYYY-MM-DD') : edd,
          },
        });
      }
    });
  };

  // 重置表单
  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="inline" className={styles.searchForm} onSubmit={this.handleSubmit}>
        <Row>
          <Col span={5}>
            <Form.Item label="住院号">
              {getFieldDecorator('inpatientNO', {
                rules: [{ required: false, message: '请输入住院号!' }],
              })(<Input style={{ minWidth: '150px' }} type="text" />)}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="姓名">
              {getFieldDecorator('name')(<Input type="text" style={{ minWidth: '150px' }} />)}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="孕产期">
              {getFieldDecorator('edd')(
                <DatePicker
                  style={{ minWidth: '150px' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择日期"
                  showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="姓名">
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button onClick={this.handleReset}>重置</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default connect(({ loading }) => ({
  loading: loading,
}))(SearchForm);