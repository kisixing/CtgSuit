import { Button, DatePicker, Form, Input } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { useEffect } from 'react';
import store from 'store';
const styles = require('./FieldForm.less');


const FieldForm = (props) => {
  const isIn = (store.get('ward') || {}).wardType === 'in'
  const noLabel = isIn ? '住院号' : '卡号'
  const noKey = isIn ? 'inpatientNO' : 'cardNO';
  const { dispatch, router, pagination, clearWard, form } = props;

  useEffect(() => {
    form.setFieldsValue({
      // eslint-disable-next-line no-undef
      startTime: __DEV__ ? moment('2019-1-1') : moment().subtract(7, 'd'),
      endTime: moment(),
    });
  }, [form])

  // 检索
  const handleSubmit = e => {
    // e.preventDefault();
    clearWard();
    const query = router.location.query;
    let pregnancyId = undefined;
    if (query) {
      pregnancyId = query.pregnancyId;
    }
    const { size, /* page */ } = pagination;
    form.validateFields().then((values) => {

      let sTime = undefined;
      let eTime = undefined;
      let { startTime, endTime, name, bedNO } = values;
      if (startTime) {
        sTime = moment(startTime).format('YYYY-MM-DD');
      }
      if (endTime) {
        eTime = moment(endTime).format('YYYY-MM-DD');
      }
      const data = {
        'pregnancyId.equals': pregnancyId,
        'visitDate.greaterOrEqualThan': sTime,
        'visitDate.lessOrEqualThan': eTime,
        'name.equals': name || undefined,
        [`${noKey}.equals`]: values[noKey] || undefined,
        ...(isIn ? { 'bedNO.equals': bedNO || undefined } : {})
      }
      // TODO
      dispatch({
        type: 'archives/fetchRecords',
        payload: {
          ...data,
          size,
          page: 0,
        },
      });
      dispatch({
        type: 'archives/fetchCount',
        payload: data,
      });
      // 检索与分页器相关关
      dispatch({
        type: 'archives/updateState',
        payload: {
          pagination: {
            size,
            page: 0
          },
        },
      });
    });
  };

  // 重置表单
  const handleReset = () => {
    props.form.resetFields();
  };

  const {
    loading,
  } = props;
  return (
    <Form
      layout="inline"
      className={styles.form}
      onFinish={handleSubmit}
      form={form}
    >
      <Form.Item label="开始日期" name="startTime">
        <DatePicker
          allowClear
          format="YYYY-MM-DD"
          placeholder="请选择开始日期"
          style={{ width: 136 }}
        />
      </Form.Item>
      <Form.Item label="结束日期" name="endTime">
        <DatePicker
          allowClear
          format="YYYY-MM-DD"
          placeholder="请选择结束日期"
        />
      </Form.Item>
      <Form.Item label="姓名" name="name">
        <Input
          allowClear
          placeholder="请输入姓名"
        />
      </Form.Item>
      <Form.Item label={noLabel} name={noKey}>
        <Input
          allowClear
          placeholder={`请输入${noLabel}`}
        />
      </Form.Item>
      {
        isIn && (
          <Form.Item label="床号" name="bedNO">
            <Input
              allowClear
              placeholder="请输入床号"
            />
          </Form.Item>
        )
      }
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading.effects['archives/fetchRecords']}
        >
          搜索
            </Button>
        <Button onClick={handleReset}>重置</Button>
      </Form.Item>
    </Form>
  );
}

export default connect(({ loading, archives, router }: any) => ({
  loading: loading,
  pagination: archives.pagination,
  router,
}))(FieldForm);