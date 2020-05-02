/*
 * @Description: 网络设置
 * @Author: Zhong Jun
 * @Date: 2019-10-06 14:51:23
 */

import store from '@/utils/SettingStore';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Form, Input, message, Radio, Row, Slider, Switch } from 'antd';
import React, { useEffect } from 'react';
import { formItemLayout, tailFormItemLayout } from './utils';
import { connect } from "dva";

const styles = require('./style.less');

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
  // alarmcolor: '报警',
};
const Alarm = (props) => {
  const [form] = Form.useForm()
  useEffect(() => {
    fetchData();
  }, [])
  const fetchData = () => {
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
          alarm_muted,
          alarm_delay,
          alarm_volumn
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
            alarm_muted,
            alarm_delay,
            alarm_volumn
          });
        },
      );
  };
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      store.set(Object.keys(values), Object.values(values)).then(status => {
        if (status) {
          message.success('设置成功', 2);
          const { alarm_muted, alarm_volumn } = values
          props.dispatch({ type: 'setting/setMuted', payload: { alarm_muted } })

          Array(3).fill(0).forEach((_, i) => {
            const t: HTMLAudioElement = document.querySelector(`#alarm${i}`)
            try {
              t && (t.volume = alarm_volumn / 10)
            } catch (e) {

            }
          })
        }
      });
    });
  };
  const reset = () => {
    store
      .reset([
        'alarm_high',
        'alarm_low',
        'alarm_on_window',
        'alarm_muted',
        'alarm_enable',
        'alarm_finished',
        'alarm_delay',
        ...Object.keys(colors),
      ])
      .then(status => {
        if (status) {
          message.success('恢复成功', 2);
          fetchData();
        }
      });
  }

  const checkboxGroup = () => (
    <Radio.Group>
      <Radio value={'1'}>打开</Radio>
      <Radio value={'0'}>关闭</Radio>
    </Radio.Group>
  );


  return (
    <Form form={form} layout="horizontal" {...formItemLayout} className={styles.form}>
      <div className={styles.subTitle}>报警设置</div>
      <Row gutter={10}>
        <Col span={8}>
          <Form.Item label="报警音量" name="alarm_volumn" rules={[{ required: false, message: '请输入报警音量!' }]}>
            <Slider max={10} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="报警静音" name="alarm_muted" rules={[{ required: false, message: '请输入报警声音!' }]}>
            <Switch />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="报警延时" name="alarm_delay" rules={[{ required: false, message: '请输入报警延时!' }]}>
            <Slider max={10} />
          </Form.Item>
        </Col>
      </Row>

      <Row>


      </Row>
      <Row>
        <Col span={8}>
          <Form.Item label="监护结束提示" name="alarm_finished" rules={[{ required: false, message: '请选择!' }]}>

            <Switch />

          </Form.Item>

        </Col>
        <Col span={8}>
          <Form.Item label="报警高亮" name="alarm_on_window" rules={[{ required: false, message: '请输入报警高亮!' }]}>

            <Switch />

          </Form.Item>
        </Col>
        {/* <Col span={8}>
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
          </Col> */}
      </Row>

      <Row>
        {Object.keys(colors).map(_ => {
          return (
            <Col span={8} key={_}>
              <Form.Item label={colors[_]} name={_} rules={[{ required: false, message: '选择颜色!' }]}>
                <Input type="color" />
              </Form.Item>
            </Col>
          );
        })}
      </Row>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" onClick={handleSubmit}>
          保存
          </Button>
        {/* <Button
          type="default"
          onClick={reset.bind(this)}
          style={{ marginLeft: 10 }}
        >
          恢复默认
          </Button> */}
      </Form.Item>
    </Form>
  );
}

export default connect()(Alarm)
