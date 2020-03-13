import React, { useEffect, useState } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Modal, Radio, Slider, Switch, Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
// import { request } from '@lianmed/utils';
import { WsService, IVolumeData } from '@lianmed/lmg/lib/services/WsService';
const socket = WsService._this;

interface IProps {
  form: WrappedFormUtils
  startTime: string
  bedname: string
  docid: string
  visible: boolean
  onCancel: () => void
  volumeData: IVolumeData
  deviceno: number
  bedno: number
}

export const SignModal = (props: IProps) => {
  const { form, deviceno, bedname, volumeData, visible, onCancel, bedno } = props;
  const [fetel_num, setFetel_num] = useState(0)
  const handleCreate = () => {
    form.validateFields(async (err, values) => {

      const { vol, ...o } = values
      socket.change_volume(deviceno, bedno, vol)
      Object.entries(o).forEach(([k, v]) => {
        const fetel_no = +k.slice(6)
        socket.mute_volume(deviceno, bedno, fetel_no, +v)
      })
      onCancel()
      message.success('设置成功')
    });
  };
  useEffect(() => {
    if (volumeData) {
      const { vol, fetel_num } = volumeData
      setFetel_num(fetel_num)
      const data = Array(fetel_num).fill(0).reduce((p, c, i) => {
        const n = i + 1
        const k = `isMute${n}`
        p[k] = !!volumeData[k]
        return p
      }, { vol })
      console.log('data', data, form)
      form.setFieldsValue(data)
    }
  }, [volumeData])

  const { getFieldDecorator } = form;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };
  return (
    <Modal
      getContainer={false}
      centered
      destroyOnClose
      visible={visible}
      title={`【${bedname}】 音量调节`}
      footer={null}
      okText="创建"
      cancelText="取消"
      bodyStyle={{ paddingRight: '48px' }}
      onCancel={onCancel}
    >
      <Form {...formItemLayout} layout="horizontal">
        <Form.Item label="音量">
          {getFieldDecorator('vol', {
            // rules: [{ max: 2, message: '最大长度为2' }],
            initialValue: 0
          })(<Slider onAfterChange={v=>{
            socket.change_volume(deviceno, bedno, v as number)
          }}/>)}
        </Form.Item>

        <Form.Item label="静音">

        </Form.Item>
        {
          Array(fetel_num).fill(0).map((_, i) => {
            const n = i + 1
            return (
              <Form.Item label={`第${n}胎`} key={i}>
                {getFieldDecorator(`isMute${n}`, {})(
                  <S onChange={v => {
                    socket.mute_volume(deviceno, bedno, n, +v)
                  }} />
                )}
              </Form.Item>
            )
          })
        }



{/* 
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            onClick={handleCreate}
          >
            确认
            </Button>
          <Button style={{ marginLeft: '24px' }} onClick={onCancel}>
            取消
            </Button>
        </div> */}
      </Form>
    </Modal>
  );
}

export default Form.create<any>()(SignModal);


const S = ({ value, ...o }: any) => (
  <Switch style={{ marginLeft: 20 }} checked={value} {...o} />
)