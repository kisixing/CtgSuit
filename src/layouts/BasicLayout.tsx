import settingStore from "@/utils/SettingStore";
import { uncompile } from '@/utils/utils';
import { WsService } from "@lianmed/lmg";
import VisitedPanel from "@lianmed/pages/lib/Remote/VisitedPanel";
import request from "@lianmed/request";
import { Layout } from 'antd';
import { connect } from 'dva';
import { ipcRenderer, remote } from 'electron';
import React, { useEffect, useLayoutEffect } from 'react';
import store from 'store';
import { router } from 'umi';
import withRouter from 'umi/withRouter';
import { context, useContextValue } from "../contexts";
import CheckNetwork from "./CheckNetwork";
import Foot from "./Foot";
import Head from "./Head";
import Side from "./Side";
import useAlarm from "./useAlarm";
import styled from 'styled-components';
const I = styled.div`
  text-shadow: #333 -9px 9px 12px;
  cursor: pointer;
  transition: all .4s;
  display:inline-block;
  // animation: go 60s ease 0s infinite alternate; 
  transform:rotate(45deg);
  transform-origin: center center;
  @keyframes go {
    　　0%   {transform:rotate(-45deg)}

    　　100% {transform:rotate(45deg)}
   
  }
`
const styles = require('./BasicLayout.less')
const EWsStatus = WsService.wsStatus
const settingData = settingStore.cache
const { Content } = Layout;
const { EWsEvents } = WsService
function BasicLayout(props: any) {
  const { dispatch, fashionable, children, wsStatus, listData } = props;
  const v = useContextValue()
  // useStomp(v.visitedData)

  useEffect(() => {
    const clickSoundEl: HTMLAudioElement = document.querySelector('#click')
    function cb(e) {
      const target = e.target as HTMLElement
      if (typeof target.className === 'string' && target.className.includes('ant-btn')) {
        clickSoundEl && clickSoundEl.play()
      }
    }
    document.addEventListener('click', cb, true)
    ipcRenderer.on('getToken', e => {
      const r = remote.getGlobal('windows').remote
      r.send('token', { ...request.configure, prefix: `${settingData['remote_url']}/api` })
    })
    remote.getCurrentWindow().setFullScreen(!!settingData.fullscreen)

    return () => {
      document.removeEventListener('click', cb)
    }
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
    <context.Provider value={v} >
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
            {/* <RightFixed /> */}
            {
              !!(settingData.public_url && settingData.remote_url) && <VisitedPanel remote_url={`http://${settingData.remote_url}`} public_url={`http://${settingData.public_url}`} />
            }
            {/* <div style={{position:'fixed',right:0,bottom:60,width:10,height:40,background:'var(--theme-color)',lineHeight:'40px',color:'#fff',textAlign:'center',cursor:'pointer'}}>||</div> */}
          </Layout>
        </Layout>
        <Foot />
        {/* <Button onClick={() => { ipcRenderer.send('newWindow', 'remote', { search: qs.stringify({ 'token': 123 }) }) }} type="primary" icon={<AlertOutlined />} shape="circle" size="large" style={{ position: 'fixed', bottom: 40, right: 10 }}></Button> */}
      </Layout>
    </context.Provider>
  );
}

const C = connect(({ global, list, loading, setting, ws, subscribe, ...rest }: any) => ({
  wsStatus: ws.status,
  fashionable: setting.fashionable,
  listData: list.listData,
  isLogin: global.isLogin,
}))(withRouter(BasicLayout));

export default class extends React.Component<any, { hasError: boolean, opened }> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, opened: false };
    this.renderBugIcon = this.renderBugIcon.bind(this)
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    ipcRenderer.send('catch', 'error', 'appCrash', error.message)
    ipcRenderer.send('catch', 'error', 'appCrash', errorInfo.componentStack)
  }
  clickCb() {
    // this.setState({ opened: !this.state.opened })
    ipcRenderer.send('openInExplorer', '.tmp/logs/app')
  }
  renderBugIcon() {

    return (
      <I style={{ fontSize: this.state.opened ? 290 : 120, }}
        onClick={this.clickCb.bind(this)}
      >🐞</I>
    )
  }
  render() {
    return this.state.hasError ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1c74a6', color: '#fff' }}>
        <div>
          <this.renderBugIcon />
          <div style={{ fontSize: 38, paddingBottom: 200 }}>
            <div>胎监工作站遇到问题，</div>
            <div>需要收集某些错误信息。</div>
          </div>
        </div>
      </div>
    ) : <C {...this.props} />
  }
}