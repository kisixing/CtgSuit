import React, { useLayoutEffect, useEffect } from 'react';
import { Layout, Button } from 'antd';
import { AlertOutlined } from "@ant-design/icons";
import { connect } from 'dva';
import { router } from 'umi';
import withRouter from 'umi/withRouter';
import store from 'store';

import qs from "qs";
import settingStore from "@/utils/SettingStore";
import { uncompile } from '@/utils/utils';
import { WsService } from "@lianmed/lmg";
import CheckNetwork from "./CheckNetwork";
import Foot from "./Foot";
import Head from "./Head";
import Side from "./Side";
import useAlarm from "./useAlarm";
import { ipcRenderer, remote } from 'electron';
import request from "@lianmed/request";
const styles = require('./BasicLayout.less')
const EWsStatus = WsService.wsStatus
const settingData = settingStore.cache
const { Content } = Layout;
const { EWsEvents } = WsService
const BasicLayout = (props: any) => {
  const { dispatch, fashionable, children, wsStatus, listData, isLogin } = props;
  useEffect(() => {

    ipcRenderer.on('getToken', e => {
      const r = remote.getGlobal('windows').remote
      r.send('token', request.configure)
    })
  }, [])
  useLayoutEffect(() => {
    const ws = new WsService(settingData)
      .on('explode', function (data) {
        dispatch({
          type: 'ws/updateData', payload: { data }
        })
      })
      .on(EWsEvents.updateSubscriptionIfNecessary, function (wardIds: string[]) {
        const ward = store.get('ward')
        const wardId = ward && ward.wardId
        wardIds.includes(wardId) && dispatch({ type: 'subscribe/update' })
      })
    try {
      ws.connect().catch(err => {
        router.push('/setting')
      })
    } catch (e) {
      router.push('/setting')
    }
    dispatch({ type: 'main/init' })

    // 每2h获取新的token
    const interval = setInterval(() => {
      const account = store.get('ACCOUNT');
      dispatch({
        type: 'login/verification',
        payload: {
          username: uncompile(account.username),
          password: uncompile(account.password),
        },
      })
    }, 1000 * 60 * 60 * 2);
    return () => {
      clearInterval(interval);
      // store.clearAll();
    }
  }, [])

  useAlarm(listData);

  return (
    <Layout
      className={styles.container}
      onClickCapture={e => {
        // if (wsStatus !== EWsStatus.Success) {
        //   // e.stopPropagation()
        //   notification.warning({
        //     message: '未建立链接, 请联系支持人员',
        //   });
        // }
      }}
    >
      <CheckNetwork visible={wsStatus !== EWsStatus.Success} />
      <Layout>
        {fashionable && <Side />}
        <Layout>
          <Head />
          <Content className={styles.main}>{children}</Content>
        </Layout>
      </Layout>
      <Foot />
      <Button onClick={() => { ipcRenderer.send('newWindow', 'remote', { search: qs.stringify({ 'token': 123 }) }) }} type="primary" icon={<AlertOutlined />} shape="circle" size="large" style={{ position: 'fixed', bottom: 40, right: 10 }}></Button>
    </Layout>
  );
}

export default connect(({ global, list, loading, setting, ws, subscribe, ...rest }: any) => ({
  wsStatus: ws.status,
  fashionable: setting.fashionable,
  listData: list.listData,
  isLogin: global.isLogin,
}))(withRouter(BasicLayout));
