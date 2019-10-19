import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Row, Col, Input, DatePicker, Button } from 'antd';

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
    console.log('init time', STARTTIME, ENDTIME);
    form.setFieldsValue({
      startTime: STARTTIME,
      endTime: ENDTIME,
    });
  }


  // 检索
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let sTime = STARTTIME.format('YYYY-MM-DD');
        let eTime = ENDTIME.format('YYYY-MM-DD');
        let { startTime, endTime } = values;
        if (startTime) {
          sTime = moment(startTime).format('YYYY-MM-DD');
        }
        if (endTime) {
          eTime = moment(endTime).format('YYYY-MM-DD');
        }
        console.log('888888888888', sTime, eTime);
        //TODO
        this.props.dispatch({
          type: 'archives/fetchRecords',
          payload: {
            // 'pregnancyId.equals': pregnancyId,
            'visitDate.greaterOrEqualThan': sTime,
            'visitDate.lessOrEqualThan': eTime,
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
      <Form layout="inline" className={styles.form} onSubmit={this.handleSubmit}>
        <Row>
          <Col span={5}>
            <Form.Item label="开始日期">
              {getFieldDecorator('startTime')(
                <DatePicker allowClear format="YYYY-MM-DD" placeholder="请选择开始日期" />,
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="结束日期">
              {getFieldDecorator('endTime')(
                <DatePicker allowClear format="YYYY-MM-DD" placeholder="请选择结束日期" />,
              )}
            </Form.Item>
          </Col>
          <Col span={5}>
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
          </Col>
        </Row>
      </Form>
    );
  }
}

export default connect(({ loading }) => ({
  loading: loading,
}))(FieldForm);