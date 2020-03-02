import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, DatePicker, Input, Button } from 'antd';

import styles from './FieldForm.less';

// 默认时间
const ENDTIME = moment();
const STARTTIME = moment().subtract(7, 'd');

@Form.create()
class FieldForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { form } = this.props;
    form.setFieldsValue({
      // eslint-disable-next-line no-undef
      startTime: __DEV__ ? moment('2019-1-1') : STARTTIME,
      endTime: ENDTIME,
    });
  }

  // 检索
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, router, form, pagination, clearWard } = this.props;
    clearWard();
    const query = router.location.query;
    let pregnancyId = undefined;
    if (query) {
      pregnancyId = query.pregnancyId;
    }
    const { size, /* page */ } = pagination;
    form.validateFields((err, values) => {
      if (!err) {
        // let sTime = STARTTIME.format('YYYY-MM-DD');
        // let eTime = ENDTIME.format('YYYY-MM-DD');
        let sTime = undefined;
        let eTime = undefined;
        let { startTime, endTime } = values;
        if (startTime) {
          sTime = moment(startTime).format('YYYY-MM-DD');
        }
        if (endTime) {
          eTime = moment(endTime).format('YYYY-MM-DD');
        }
        // TODO
        dispatch({
          type: 'archives/fetchRecords',
          payload: {
            'pregnancyId.equals': pregnancyId,
            'visitDate.greaterOrEqualThan': sTime,
            'visitDate.lessOrEqualThan': eTime,
            size,
            page: 0,
          },
        });
        dispatch({
          type: 'archives/fetchCount',
          payload: {
            'pregnancyId.equals': pregnancyId,
            'visitDate.greaterOrEqualThan': sTime,
            'visitDate.lessOrEqualThan': eTime,
          },
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
      }
    });
  };

  // 重置表单
  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form
        layout="inline"
        className={styles.form}
        onSubmit={this.handleSubmit}
      >
        <Row>
          <Form.Item label="开始日期">
            {getFieldDecorator('startTime')(
              <DatePicker
                allowClear
                format="YYYY-MM-DD"
                placeholder="请选择开始日期"
                style={{ width: 136 }}
              />,
            )}
          </Form.Item>
          <Form.Item label="结束日期">
            {getFieldDecorator('endTime')(
              <DatePicker
                allowClear
                format="YYYY-MM-DD"
                placeholder="请选择结束日期"
              />,
            )}
          </Form.Item>
        {/* <Col span={4}>
          <Form.Item label="姓名">
            {getFieldDecorator('name')(
              <Input
                disabled
                allowClear
                placeholder="请输入孕妇姓名"
              />,
            )}
          </Form.Item>
        </Col> */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading.effects['archives/fetchRecords']}
            >
              搜索
            </Button>
            <Button onClick={this.handleReset}>重置</Button>
          </Form.Item>
        </Row>
      </Form>
    );
  }
}

export default connect(({ loading, archives, router }) => ({
  loading: loading,
  pagination: archives.pagination,
  router,
}))(FieldForm);