import React, { useLayoutEffect, useEffect } from 'react';
import { Layout, message } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import withRouter from 'umi/withRouter';
import store from 'store';
import { ipcRenderer } from 'electron';
// import logo from '../assets/logo.png';

import settingStore from "@/utils/SettingStore";
import { WsService } from "@lianmed/lmg";
import CheckNetwork from "./CheckNetwork";
import Foot from "./Foot";
import Head from "./Head";
import Side from "./Side";
import useAlarm from "./useAlarm";
import { request } from '@lianmed/utils';
import { IWard } from "@/types";

const styles = require('./BasicLayout.less')
const EWsStatus = WsService.wsStatus
const settingData = settingStore.cache
const { Content } = Layout;

const BasicLayout = (props: any) => {

  const { dispatch, fashionable, children, wsStatus, listData } = props;

  useLayoutEffect(() => {
    ipcRenderer.send('ready')
    ipcRenderer.on('installed', () => {
      message.success('更新成功', 2).then(() => {
        // eslint-disable-next-line no-restricted-globals
        location.reload()
      }, null)
    })
    const ward = settingStore.getSync('ward') || { id: '' }
    console.log('wardId', typeof ward, ward)

    request.get(`/wards/${ward.id}`).then(({ note, wardType, wardId }: IWard) => {

      note && wardType && wardId && dispatch({ type: 'subscribe/setData', note, wardType, wardId })
    })
    const ws = new WsService(settingData).on('explode', data => {
      dispatch({
        type: 'ws/updateData', payload: { data }
      })
    })
    try {
      ws.connect().catch(err => {
        router.push('/setting')
      })
    } catch (e) {
      router.push('/setting')
    }

    dispatch({
      type: 'global/fetchAccount',
    });
    dispatch({
      type: 'list/getlist',
    });
    dispatch({
      type: 'ws/connectWs',
    });
    // send ipcMain
    ipcRenderer.send('clear-all-store', {
      name: 'clear all stroe!!!',
      age: '18',
      clearAll: () => store.clearAll(),
    });
    // 每2h获取新的token
    const interval = setInterval(() => {
      const account = store.get('ACCOUNT');
      dispatch({
        type: 'login/verification',
        payload: account
      });
    }, 1000 * 60 * 60 * 2);
    return () => {
      clearInterval(interval);
    };
  }, [dispatch])


  useAlarm(listData);

  useEffect(() => {
    // Specify how to clean up after this effect:
    return function cleanup() {
      store.store.clearAll();
    };
  });

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

        {
          fashionable && <Side />
        }
        <Layout>
          <Head />

          <Content className={styles.main}>{children}</Content>
        </Layout>

      </Layout>
      <Foot />
    </Layout>
  );
}

export default connect(({ global, list, loading, setting, ws, subscribe, ...rest }: any) => ({
  wsStatus: ws.status,
  fashionable: setting.fashionable,
  listData: list.listData

}))(withRouter(BasicLayout));
