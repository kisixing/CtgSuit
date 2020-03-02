
import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, Select, DatePicker, Button } from 'antd';
import EditModal from './EditModal';
import SettingStore from '@/utils/SettingStore';

import styles from './index.less';
import store from "store";

@Form.create()
class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    const ward = store.get('ward') || {}
    const isIn = ward.wardType === 'in'

    this.isIn = isIn
    this.noKey = this.isIn ? 'inpatientNO' : 'cardNO';
    this.noLabel = this.isIn ? '住院号' : '卡号'
  }

  componentDidMount() {
    this.isIn && this.props.form.setFieldsValue({ recordstate: '10' });
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
    const { size, page } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        const { name, recordstate, edd } = values;
        const params = {
          [`${this.noKey}.contains`]: values[this.noKey],
          'name.contains': name,
          'recordstate.equals': recordstate || undefined,
          'edd.equals': edd ? moment(edd).format('YYYY-MM-DD') : edd,
        };
        this.props.dispatch({
          type: 'pregnancy/fetchPregnancies',
          payload: params,
        });
        this.props.dispatch({
          type: 'pregnancy/updateState',
          payload: {
            pagination: {
              size,
              page: 0,
            },
          }
        })
        this.fetchCount(params);
      }
    });
  };

  fetchCount = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pregnancy/fetchCount',
      payload: {
        'recordstate.equals': this.isIn ? '10' : undefined,
        ...params,
      },
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
        'recordstate.equals': this.isIn ? '10' : undefined,
      },
    });
  };

  render() {
    const { visible } = this.state;
    const {
      form: { getFieldDecorator },
      ...rest
    } = this.props;
    return <>
      <Form
        layout="inline"
        className={styles.searchForm}
        onSubmit={this.handleSubmit}
      >
        <Row>
          <Form.Item label={this.noLabel}>
            {getFieldDecorator(this.noKey, {
              rules: [
                { required: false, message: `请输入${this.noLabel}!` },
              ],
              getValueFromEvent: event =>
                event.target.value.replace(/\s+/g, ''),
            })(<Input allowClear type="text" />)}
          </Form.Item>
          <Form.Item label="姓名">
            {getFieldDecorator('name', {
              getValueFromEvent: event => event.target.value.trim(),
            })(<Input allowClear type="text" />)}
          </Form.Item>
          {this.isIn && (
            <Form.Item label="住院状态">
              {getFieldDecorator('recordstate')(
                <Select allowClear style={{ width: 174 }}>
                  <Select.Option value="10">住院中</Select.Option>
                  <Select.Option value="20">已出院</Select.Option>
                  <Select.Option value="30">门诊</Select.Option>
                </Select>,
              )}
            </Form.Item>
          )}
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
          <Form.Item label="">
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button onClick={this.handleReset}>重置</Button>
            <Button onClick={this.show}>ADT</Button>
          </Form.Item>
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
    </>;
  }
}

export default connect(({ loading }) => ({
  loading: loading,
}))(SearchForm);