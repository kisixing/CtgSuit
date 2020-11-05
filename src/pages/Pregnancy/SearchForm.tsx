
import { Button, DatePicker, Form, Input, Row, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import React, { useState } from 'react';
import EditModal from './EditModal';

const styles = require('./index.less')

const SearchForm = (props: { [x: string]: any, form: FormInstance }) => {
  const { form, handCreate, handleSubmit, updateItem, isOut } = props;

  const [visible, setVisible] = useState(false)

  const noKey = isOut ? 'cardNO' : 'inpatientNO';
  const noLabel = isOut ? '卡号' : '住院号'


  const hide = () => {
    setVisible(false)
  };

  const show = () => {
    setVisible(true)
  };




  // 重置表单
  const handleReset = () => {
    form.resetFields();
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
        {isOut || (
          <Form.Item label="住院状态" name="recordstate">
            <Select allowClear style={{ width: 174 }}>
              <Select.Option value="10">住院中</Select.Option>
              <Select.Option value="20">已出院</Select.Option>
              <Select.Option value="30">门诊</Select.Option>
            </Select>
          </Form.Item>
        )}
        <Form.Item label="预产期" name="mtod_edd">
          <DatePicker
            allowClear
            style={{ minWidth: '168px' }}
            // format="YYYY-MM-DD"
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
        onUpdate={updateItem}
        onCreate={handCreate}
      />
    ) : null}
  </>;
}

export default SearchForm;