/*
 * @Description: 网络设置
 * @Author: Zhong Jun
 * @Date: 2019-10-06 14:51:23
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { InputNumber, Button, message, Radio, Input, Row, Col } from 'antd';
import store from '@/utils/SettingStore';

import { formItemLayout, tailFormItemLayout } from './utils';
import styles from './style.less';

const colors = {
  // normalarea: '正常区域',
  // selectarea: '打印区域',
  // rule: '刻度',
  // scale: '时间轴',
  // primarygrid: '主网格',
  // secondarygrid: '次网格',
  fhrcolor1: 'FHR1',
  fhrcolor2: 'FHR2',
  fhrcolor3: 'FHR3',
  tococolor: 'TOCO',
  alarmcolor: '报警',
};
@Form.create()
class Network extends Component {
  componentDidMount() {
    this.fetchData();
  }
  fetchData = () => {
    const { form } = this.props;
    store
      .getObj()
      .then(
        ({
          // normalarea,
          // selectarea,
          // rule,
          // scale,
          // primarygrid,
          // secondarygrid,
          fhrcolor1,
          fhrcolor2,
          fhrcolor3,
          tococolor,
          alarmcolor,
          alarm_finished,
          alarm_enable,
          alarm_high,
          alarm_low,
          alarm_on_window,
          alarm_on_sound,
        }) => {
          form.setFieldsValue({
            // normalarea,
            // selectarea,
            // rule,
            // scale,
            // primarygrid,
            // secondarygrid,
            fhrcolor1,
            fhrcolor2,
            fhrcolor3,
            tococolor,
            alarmcolor,
            alarm_finished,
            alarm_enable,
            alarm_high,
            alarm_low,
            alarm_on_window,
            alarm_on_sound,
          });
        },
      );
  };
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        store.set(Object.keys(values), Object.values(values)).then(status => {
          if (status) {
            message.success('设置成功', 2);
          }
        });
      }
    });
  };
  reset() {
    store
      .reset([
        'alarm_high',
        'alarm_low',
        'alarm_on_window',
        'alarm_on_sound',
        'alarm_enable',
        'alarm_finished',
        ...Object.keys(colors),
      ])
      .then(status => {
        if (status) {
          message.success('恢复成功', 2);
          this.fetchData();
        }
      });
  }

  checkboxGroup = () => (
    <Radio.Group>
      <Radio value={'1'}>打开</Radio>
      <Radio value={'0'}>关闭</Radio>
    </Radio.Group>
  );

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form layout="horizontal" {...formItemLayout} className={styles.form}>
        <div className={styles.subTitle}>CTG曲线设置</div>
        <Row>
          <Col span={8}>
            <Form.Item label="胎心率上限">
              {getFieldDecorator('alarm_high', {
                rules: [{ required: false, message: '请输入胎心率上限!' }],
              })(<InputNumber placeholder="请输入胎心率上限!" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="胎心率下限">
              {getFieldDecorator('alarm_low', {
                rules: [{ required: false, message: '请输入胎心率下限!' }],
              })(<InputNumber placeholder="请输入胎心率下限!" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item label="报警高亮">
              {getFieldDecorator('alarm_on_window', {
                rules: [{ required: false, message: '请输入报警高亮!' }],
              })(
                <Radio.Group>
                  <Radio value={'1'}>打开</Radio>
                  <Radio value={'0'}>关闭</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="报警声音">
              {getFieldDecorator('alarm_on_sound', {
                rules: [{ required: false, message: '请输入报警声音!' }],
              })(
                <Radio.Group>
                  <Radio value={'1'}>打开</Radio>
                  <Radio value={'0'}>关闭</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Form.Item label="监护结束提示">
              {getFieldDecorator('alarm_finished', {
                rules: [{ required: false, message: '请选择!' }],
              })(
                <Radio.Group>
                  <Radio value={'1'}>打开</Radio>
                  <Radio value={'0'}>关闭</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="开启报警">
              {getFieldDecorator('alarm_enable', {
                rules: [{ required: false, message: '请选择!' }],
              })(
                <Radio.Group>
                  <Radio value={'1'}>打开</Radio>
                  <Radio value={'0'}>关闭</Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row>
          {Object.keys(colors).map(_ => {
            return (
              <Col span={8} key={_}>
                <Form.Item label={colors[_]}>
                  {getFieldDecorator(_, {
                    rules: [{ required: false, message: '选择颜色!' }],
                  })(<Input type="color" />)}
                </Form.Item>
              </Col>
            );
          })}
        </Row>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" onClick={this.handleSubmit}>
            保存
          </Button>
          <Button
            type="default"
            onClick={this.reset.bind(this)}
            style={{ marginLeft: 10 }}
          >
            恢复默认
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ setting, loading }) => ({
  loading: loading,
}))(Network);
