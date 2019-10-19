
import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Row, Col, Input, Select, DatePicker, Button, message } from 'antd';
import EditModal from './EditModal';

import styles from './index.less';

@Form.create()
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    this.props.form.setFieldsValue({ recordstate: '10' });
  }


  hide = () => {
    this.setState({ visible: false });
  };

  show = () => {
    this.setState({ visible: true });
  };

  // 检索
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const { inpatientNO, name, recordstate, edd } = values;
        this.props.dispatch({
          type: 'pregnancy/fetchPregnancies',
          payload: {
            'inpatientNO.contains': inpatientNO,
            'name.contains': name,
            'recordstate.equals': recordstate,
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

  // 修改
  handleUpdate = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pregnancy/update',
      payload: values,
    }).then(() => this.reloadData());
  };

  // ADT创建孕册
  handCreate = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pregnancy/create',
      payload: values,
    }).then(() => {
      this.reloadData();
    });
  };

  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pregnancy/fetchPregnancies',
      payload: {
        'recordstate.equals': '10',
      },
    });
  }

  render() {
    const { visible } = this.state;
    const {
      form: { getFieldDecorator },
      ...rest
    } = this.props;
    return (
      <>
        <Form layout="inline" className={styles.searchForm} onSubmit={this.handleSubmit}>
          <Row>
            <Col span={4}>
              <Form.Item label="住院号">
                {getFieldDecorator('inpatientNO', {
                  rules: [{ required: false, message: '请输入住院号!' }],
                })(<Input allowClear type="text" />)}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="姓名">
                {getFieldDecorator('name')(<Input allowClear type="text" />)}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="住院状态">
                {getFieldDecorator('recordstate')(
                  <Select allowClear style={{ width: 174 }}>
                    <Select.Option value="10">住院中</Select.Option>
                    <Select.Option value="11">已出院</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="预产期">
                {getFieldDecorator('edd')(
                  <DatePicker
                    allowClear
                    style={{ minWidth: '168px' }}
                    format="YYYY-MM-DD"
                    placeholder="请选择日期"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item label="">
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button onClick={this.handleReset}>重置</Button>
                <Button onClick={this.show}>ADT</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {visible ? (
          <EditModal
            {...rest}
            visible={visible}
            onCancel={this.hide}
            onUpdate={this.handleUpdate}
            onCreate={this.handCreate}
          />
        ) : null}
      </>
    );
  }
}

export default connect(({ loading }) => ({
  loading: loading,
}))(SearchForm);