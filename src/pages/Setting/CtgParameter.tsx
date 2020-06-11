
import store from '@/utils/SettingStore';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Form, InputNumber, message, Radio, Row, Input } from 'antd';
import { connect } from 'dva';
import React, { useEffect } from 'react';
import { formItemLayout, tailFormItemLayout } from './utils';

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
const Network = ({ isAdmin }) => {
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
          alarm_finished
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
            alarm_finished
          });
        },
      );
  };
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      store.set(Object.keys(values), Object.values(values)).then(status => {
        if (status) {
          message.success('设置成功', 2);
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
        'alarm_enable',
        'alarm_finished',
        ...Object.keys(colors),
      ])
      .then(status => {
        if (status) {
          message.success('恢复成功', 2);
          fetchData();
        }
      });
  }



  return (
    <Form
      form={form}
      layout="horizontal"
      {...formItemLayout}
      className={styles.form}
    >
      <div className={styles.subTitle}>CTG曲线设置</div>
      <Row>
      </Row>

      <Row>
        <Col span={8}>
          <Form.Item
            label="监护结束提示"
            name="alarm_finished"
            rules={[{ required: false, message: '请选择!' }]}
          >
            <Radio.Group>
              <Radio value={'1'}>打开</Radio>
              <Radio value={'0'}>关闭</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        {Object.keys(colors).map(_ => {
          return (
            <Col span={8} key={_}>
              <Form.Item
                label={colors[_]}
                name={_}
                rules={[{ required: false, message: '选择颜色!' }]}
              >
                <Input type="color" />
              </Form.Item>
            </Col>
          );
        })}
      </Row>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" onClick={handleSubmit} disabled={!isAdmin}>
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

const Ctg = connect(({ setting, loading }: any) => ({
  loading: loading,
}))(Network);
Ctg.displayName = '胎监参数设置'
export default Ctg