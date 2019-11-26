import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import cx from 'classnames';
import { event } from "@lianmed/utils";
import CollectionCreateForm from './CollectionCreateForm';
import Analysis from './Analysis';
import PrintPreview from './PrintPreview';
import Partogram from './Partogram';
import ModalConfirm from './ModalConfirm';
import SignModal from './SignModal';
import { WsService } from '@lianmed/lmg';
import { BedStatus } from '@lianmed/lmg/lib/services/WsService';
import { IBed } from '@/types';
import { Suit } from '@lianmed/lmg/lib/Ctg/Suit';
let styles = require('./Item.less')

const socket = WsService._this;


interface IProps {
  dataSource: IBed
  dispatch: any
  suitObject: { suit: Suit }
  showLoading: (s: boolean) => void
  isTodo: boolean
}

function Toolbar(props: IProps) {

  const [showSetting, setShowSetting] = useState(false)

  const [isStopMonitorWhenCreated, setIsStopMonitorWhenCreated] = useState(false)
  let endCb: () => {};
  const [modalName, setModalName] = useState('')
  const onclose = cb => {
    endCb = cb;
    showModal('confirmVisible');
  };
  const { dataSource, showLoading, isTodo, dispatch, ...rest } = props
  const { unitId, data, bedname, deviceno, bedno, } = dataSource



  const { docid, starttime } = data

  useEffect(() => {
    event.on(`bedClose:${unitId}`, onclose)
    return () => {
      event.off(`bedClose:${unitId}`, onclose)
    }
  }, [unitId])


  let timeout = null;
  const autoHide = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setShowSetting(false)
    }, 15000);
  };
  const toggleTool = () => {
    setShowSetting(!showSetting);
    autoHide();
  };

  const showModal = name => {
    // props.dispatch({
    //   type: 'item/updateState',
    //   payload: {
    //     ctgData: null,
    //   },
    // });
    setModalName(name);
  };

  const handleCancel = () => {
    setModalName('');
  };

  // 检验数据库是否已经建册了

  /**
   * 建档（绑定孕册信息）
   *
   * @param {object} item 改设备数据
   * @param {object} values 创建表单form数据
   */


  // 开始设备监控
  // 增加2s的loading
  const start = () => {

    showLoading(true);
    socket.startwork(deviceno, bedno);
    setTimeout(() => {
      showLoading(false);
    }, 1500);
  };

  // 停止监护
  const end = () => {
    // TODO 逻辑混乱
    const { dispatch } = props;

    const pregnancy = data.pregnancy
    const isCreated = pregnancy && pregnancy.id;
    data.status === BedStatus.Working ?
      // dispatch({
      //   type: 'list/appendDirty',
      //   unitId,
      // })
      console.log('working end')
      : dispatch({
        type: 'list/appendOffline',
        unitId,
      });
    if (isCreated) {
      // 已经建档 ,修改结束时间
      // 获取ctg曲线档案id，重新调用获取bedinfo
      // 与app的流程一致
      // app的结束 流程是 查bedinfo 获取 prental信息 然后 put prental-visits 接口成功调用ws endwork
      // 避免 多客户端 之间通信的保持问题。 即使当前设备离线 流程应该也不影响
      dispatch({
        type: 'list/fetchBed',
        payload: {
          'pregnancyId.equals': pregnancy.id,
        },
        callback: res => {
          const d = res[0];
          if (d && d.id) {
            const prenatalVisit = d['prenatalVisit'];
            dispatch({
              type: 'archives/update',
              payload: {
                id: prenatalVisit.id,
                pregnancy: {
                  id: pregnancy.id,
                },
                ctgexam: {
                  ...prenatalVisit.ctgexam,
                  startTime: moment(prenatalVisit.ctgexam.startTime),
                  endTime: moment(),
                  note: d.documentno,
                },
              },
            });
          }
        }
      });
    } else {
      // 未建档提示简单保存或者放弃保存
      dispatch({
        type: 'archives/noSaveCTG',
        payload: docid,
      });
    }
    socket.endwork(deviceno, bedno);
    if (endCb) {
      endCb();
      endCb = null;
    }
  };

  // 未建档停止监，选择建档时，重定向打开建档窗口
  const redirectCreate = () => {
    setIsStopMonitorWhenCreated(true)
    setModalName('visible')

  };

  // TODO 未实现CTG组件更新
  // 11.14 胎位标记 fhr position
  const sign = values => {
    const { dispatch, suitObject } = props;
    const position = JSON.parse(values.fetalposition);
    console.log('Received values of form: ', suitObject, position);
    suitObject.suit.setfetalposition(position.fhr1, position.fhr2, position.fhr3);
    dispatch({
      type: 'item/updateCTGnote',
      payload: {
        ...values,
        endTime: '',
      },
    }).then(() => {
      setModalName('')
    });

    setTimeout(() => {
      setModalName('')

    }, 1500);
  };



  // 处于监护状态
  const isMonitor = data && data.status === 1;
  // 离线状态
  const isOffline = data && data.status === 3;
  // 已建档状态
  const pregnancy = data && data.pregnancy;

  const isCreated = pregnancy && pregnancy.id;
  return (
    <>
      <div className={cx(styles.toolbar, { [styles.show]: showSetting })}>
        {isMonitor || isOffline ? (
          <Button
            icon="pause-circle"
            type="link"
            onClick={() => showModal('confirmVisible')}
          >
            停止监护
            </Button>
        ) : (
            <Button
              disabled={data.index === undefined}
              icon="play-circle"
              type="link"
              onClick={start}
            >
              开始监护
            </Button>
          )}
        {/* 停止状态下不可以建档，监护、离线都是可以建档的 */}
        <Button
          icon="user-add"
          type="link"
          disabled={(isCreated && docid) || isCreated}
          onClick={() => showModal('visible')}
        >
          {isCreated ? '已建档' : '建档'}
        </Button>
        <Button
          disabled={!isCreated}
          icon="pushpin"
          type="link"
          onClick={() => showModal('signVisible')}
        >
          胎位标记
          </Button>
        <Button
          disabled={!isCreated}
          icon="pie-chart"
          type="link"
          onClick={() => showModal('analysisVisible')}
        >
          电脑分析
          </Button>
        <Button
          disabled={!isCreated}
          icon="printer"
          type="link"
          onClick={() => showModal('printVisible')}
        >
          报告
          </Button>
        {/* <Button
            disabled={!isCreated}
            icon="line-chart"
            type="link"
            onClick={() => showModal('partogramVisible')}
          >
            产程图
          </Button> */}
        {/* <Link to="">
            <Button icon="reconciliation" type="link">
              事件记录
            </Button>
          </Link> */}
      </div>
      <div
        className={styles.actionButton}
      >
        <Button
          icon={showSetting ? 'left' : 'right'}
          shape={showSetting ? 'circle' : null}
          style={{ boxShadow: '#aaa 3px 3px 5px 1px' }}
          type="primary"
          onClick={toggleTool}
        />
      </div>
      {modalName === 'visible' ? (
        <CollectionCreateForm
          visible={modalName === 'visible'}
          onCancel={() => {
            handleCancel()
            setIsStopMonitorWhenCreated(false);

          }}
          // dataSource={dataSource}
          isTodo={isTodo}
          docid={docid}
          starttime={starttime}
          bedname={bedname}
          dispatch={dispatch}
          onCreated={res => {
            // setState({ isCreated: true });
            event.emit('newArchive', res);
            // 完成绑定后判断是否停止监护工作（未建档停止监护时补充建档内容）
            if (isStopMonitorWhenCreated) {
              end();
              setIsStopMonitorWhenCreated(false);
            }
          }}
        />
      ) : null}
      <Analysis
        visible={modalName === 'analysisVisible'}
        onCancel={handleCancel}
        dataSource={dataSource}
        docid={docid}
      />
      {modalName === 'printVisible' ? (
        <PrintPreview
          visible={modalName === 'printVisible'}
          onCancel={handleCancel}
          dataSource={dataSource}
        />
      ) : null}
      <Partogram
        visible={modalName === 'partogramVisible'}
        onCancel={handleCancel}
        dataSource={dataSource}
      />
      <ModalConfirm
        visible={modalName === 'confirmVisible'}
        dataSource={dataSource}
        isCreated={isCreated}
        isMonitor={isMonitor}
        onCancel={handleCancel}
        onOk={end}
        onCreate={redirectCreate}
      />
      <SignModal
        {...rest}
        visible={modalName === 'signVisible'}
        dataSource={dataSource}
        isCreated={isCreated}
        isMonitor={isMonitor}
        onCancel={handleCancel}
        onCreate={sign}
      />
    </>
  );
}

export default connect(({ item }: any) => ({
  pregnancy: item.pregnancy,
}))(Toolbar);
