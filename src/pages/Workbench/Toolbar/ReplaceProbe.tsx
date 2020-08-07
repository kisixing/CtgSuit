/**
 * 胎监主页PDA建档/绑定弹窗
 */
import React, { useEffect, useState, memo } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Modal, Input, Row, Col, InputNumber, message, Table } from 'antd';
import _ from 'lodash';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import moment from 'moment';
// import { request } from '@lianmed/utils';
import { event } from '@lianmed/utils';


import { WsService } from '@lianmed/lmg';
const socket = WsService._this;
interface IProps {
  bedname: string
  deviceno: string
  bedno: string
  end: () => void,
  unitId: string
}
const ReplaceProbe = ({ bedname, unitId, end, deviceno, bedno }: IProps) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {


    const replace_probe_tip_key = `item_probetip:${unitId}`
    const on_replace_probe_tip = data => {
      setVisible(true)
    }
    event
      .on(replace_probe_tip_key, on_replace_probe_tip)
    return () => {
      event
        .off(replace_probe_tip_key, on_replace_probe_tip)
    }
  }, [unitId])

  return (
    <Modal
      getContainer={false}
      centered
      destroyOnClose
      width={760}
      visible={visible}
      title={`【${bedname}】 更换探头`}
      footer={null}

      bodyStyle={{}}
      onCancel={() => setVisible(false)}
    >
      <Button type="danger" onClick={() => { end(); setVisible(false) }}>结束监护</Button>
      <Button type="primary" onClick={() => { socket.replace_probe(+deviceno, +bedno, data); setVisible(false) }}>更换探头</Button>
      <Button onClick={() => setVisible(false)}>取消</Button>
    </Modal>
  );
}

export default memo(Form.create<IProps>()(ReplaceProbe))
