
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, Select, DatePicker, Button, Form } from 'antd';
import EditModal from './EditModal';
import store from "store";
import { FormInstance } from 'antd/lib/form';

const styles = require('./index.less')

const SearchForm = (props: { [x: string]: any, form: FormInstance }) => {
  const { size, clearWard, dispatch, form } = props;

  const [visible, setVisible] = useState(false)
  const ward = store.get('ward') || {}
  const isIn = ward.wardType === 'in'

  const noKey = isIn ? 'inpatientNO' : 'cardNO';
  const noLabel = isIn ? '住院号' : '卡号'


  const hide = () => {
    setVisible(false)
  };

  const show = () => {
    setVisible(true)
  };

  // 检索
  const handleSubmit = () => {
    // e.preventDefault();
    // 高级检索置空病区
    clearWard();
    form.validateFields().then((values) => {
      // console.log('Received values of form: ', values);
      const { name, recordstate, edd } = values;
      const params = {
        [`${noKey}.contains`]: values[noKey],
        'name.contains': name,
        'recordstate.equals': recordstate || undefined,
        'edd.equals': edd ? moment(edd).format('YYYY-MM-DD') : edd,
      };
      dispatch({
        type: 'pregnancy/fetchPregnancies',
        payload: params,
      });
      dispatch({
        type: 'pregnancy/updateState',
        payload: {
          pagination: {
            size,
            page: 0,
          },
        }
      })
      fetchCount(params);
    });
  };

  const fetchCount = params => {
    dispatch({
      type: 'pregnancy/fetchCount',
      payload: {
        'recordstate.equals': isIn ? '10' : undefined,
        ...params,
      },
    });
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
  };

  // 修改
  const handleUpdate = values => {
    dispatch({
      type: 'pregnancy/update',
      payload: values,
    }).then(() => reloadData());
  };

  // ADT创建孕册
  const handCreate = values => {
    dispatch({
      type: 'pregnancy/create',
      payload: values,
      callback:reloadData
    })
  };

  const reloadData = () => {
    dispatch({
      type: 'pregnancy/fetchPregnancies',
      payload: {
        'recordstate.equals': isIn ? '10' : undefined,
      },
    });
  };


  return <>
    <Form
      layout="inline"
      className={styles.searchForm}
      onFinish={handleSubmit}
      form={form}
      initialValues={{ recordstate: '10' }}
    >
      <Row>
        <Form.Item label={noLabel} name={noKey}
          getValueFromEvent={event => event.target.value.replace(/\s+/g, '')}
        >
          <Input allowClear type="text" />
        </Form.Item>
        <Form.Item label="姓名" name="name" getValueFromEvent={event => event.target.value.trim()} >
          <Input allowClear type="text" />
        </Form.Item>
        {isIn && (
          <Form.Item label="住院状态" name="recordstate">
            <Select allowClear style={{ width: 174 }}>
              <Select.Option value="10">住院中</Select.Option>
              <Select.Option value="20">已出院</Select.Option>
              <Select.Option value="30">门诊</Select.Option>
            </Select>
          </Form.Item>
        )}
        <Form.Item label="预产期" name="edd">
          <DatePicker
            allowClear
            style={{ minWidth: '168px' }}
            format="YYYY-MM-DD"
            placeholder="请选择日期"
          />
        </Form.Item>
        <Form.Item label="">
          <Button type="primary" htmlType="submit">
            搜索
            </Button>
          <Button onClick={handleReset} type="primary">重置</Button>
          <Button onClick={show} type="primary">新增</Button>
        </Form.Item>
      </Row>
    </Form>
    {visible ? (
      <EditModal
        {...props}
        visible={visible}
        onCancel={hide}
        onUpdate={handleUpdate}
        onCreate={handCreate}
      />
    ) : null}
  </>;
}

export default connect(({ loading }: any) => ({
  loading,
}))(SearchForm);