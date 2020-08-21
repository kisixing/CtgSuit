/**
 * 胎监主页PDA建档/绑定弹窗
 */
import React, { useEffect, useState, memo } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Divider, Input, Row, Col, InputNumber, message, Table } from 'antd';
import _ from 'lodash';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import moment from 'moment';
import { WsService, IVolumeData, ICacheItem } from '@lianmed/lmg/lib/services/WsService';

// import { request } from '@lianmed/utils';
import { event } from '@lianmed/utils';


const socket = WsService._this;
interface IProps {

  onCancel: () => void
  data: ICacheItem

}
const ReplaceProbe = ({ data, onCancel }: IProps) => {
  const { device_no, bed_no, id, replaceProbeTipData,isUncreated } = data
  if(isUncreated){
    onCancel()
  }
  const end = () => {
    event.emit(`item_close:${id}`)
    onCancel()
  }
  const replace = () => {
    socket.replace_probe(device_no, bed_no, replaceProbeTipData as any);
    onCancel()
  }

  return (

    <div >
      <div style={{ marginBottom: 24 }}>探头卡回基座，是否进行以下操作：</div>
      <Button type="primary" onClick={end}>结束监护</Button>
      <Divider type="vertical" />
      <Button onClick={replace}>更换探头</Button>
      <Divider type="vertical" />
      <Button onClick={onCancel}>取消</Button>
    </div>
  );
}

export default (ReplaceProbe)
