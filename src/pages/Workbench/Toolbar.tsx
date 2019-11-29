import React, { useState, useEffect,useRef } from 'react';
import { Button } from 'antd';
import moment from 'moment';
import { event, request } from "@lianmed/utils";
import CollectionCreateForm from './CollectionCreateForm';
import Analysis from './Analysis';
import PrintPreview from './PrintPreview';
import Partogram from './Partogram';
import ModalConfirm from './ModalConfirm';
import SignModal from './SignModal';
import { WsService } from '@lianmed/lmg';
import { BedStatus } from '@lianmed/lmg/lib/services/WsService';
import { FetalItem } from "./types";
import { ButtonProps } from 'antd/lib/button';

const socket = WsService._this;

function Toolbar(props: FetalItem.IToolbarProps) {
  const [showSetting, setShowSetting] = useState(false)
  const [isStopMonitorWhenCreated, setIsStopMonitorWhenCreated] = useState(false)
  const endCb = useRef(null)
  const [modalName, setModalName] = useState('')
  const onclose = cb => {
    endCb.current = cb;
    setModalName('confirmVisible');
  };
  const {
    showLoading,
    isTodo,
    inpatientNO,
    name,
    gestationalWeek,
    startTime,
    age,
    suitObject,
    docid,
    status,
    unitId,
    index,
    deviceno,
    bedno,
    bedname,
    pregnancyId
  } = props


  const isMonitor = status === BedStatus.Working;
  const isOffline = status === BedStatus.Offline;
  const isCreated = !!pregnancyId;

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

  const handleCancel = () => setModalName('');


  const start = () => {
    showLoading(true);
    socket.startwork(deviceno, bedno);
    setTimeout(() => {
      showLoading(false);
    }, 1500);
  };

  const end = async () => {


    if (isCreated) {
      // 已经建档 ,修改结束时间
      // 获取ctg曲线档案id，重新调用获取bedinfo
      // 与app的流程一致
      // app的结束 流程是 查bedinfo 获取 prental信息 然后 put prental-visits 接口成功调用ws endwork
      // 避免 多客户端 之间通信的保持问题。 即使当前设备离线 流程应该也不影响


      const res = await request.get(`/bedinfos?pregnancyId.equals=${pregnancyId}`);
      const d = res[0];
      if (d && d.id) {
        const prenatalVisit = d['prenatalVisit'];
        await request.put(`/prenatal-visits`, {
          data: {
            id: prenatalVisit.id,
            pregnancy: { id: pregnancyId, },
            ctgexam: {
              ...prenatalVisit.ctgexam,
              startTime: moment(prenatalVisit.ctgexam.startTime),
              endTime: moment(),
              note: d.documentno,
            },
          },
        });

      }

    } else {
      // 未建档提示简单保存或者放弃保存
      await request.get(`/ctg-exams-nosaving/${docid}`);
    }

    socket.endwork(deviceno, bedno);

    if (endCb.current) {
      endCb.current();
      endCb.current = null;
    }
  };

  // 未建档停止监，选择建档时，重定向打开建档窗口
  const redirectCreate = () => {
    setIsStopMonitorWhenCreated(true)
    setModalName('visible')

  };

  const B = (p: ButtonProps) => <Button style={{ padding: '0 8px' }} {...p}>{p.children}</Button>
  const fp = 12
  return (
    <>
      <div style={{
        position: 'absolute',
        left: 5 * fp,
        bottom: 2 * fp,
        // right: 3 * @float-padding + 60px,
        zIndex: 9,
        height: 32,
        width: showSetting ? `calc(100% - ${4 * fp}px - 36px)` : 0,
        background: '#fff',
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: '#aaa 3px 3px 5px 1px',
        opacity: showSetting ? 1 : 0,
        transition: 'all 0.2s ease-out',
      }}>
        {isMonitor || isOffline ? (
          <B
            icon="pause-circle"
            type="link"
            onClick={() => setModalName('confirmVisible')}
          >
            停止监护
            </B>
        ) : (
            <B
              disabled={index === undefined}
              icon="play-circle"
              type="link"
              onClick={start}
            >
              开始监护
            </B>
          )}
        {/* 停止状态下不可以建档，监护、离线都是可以建档的 */}
        <B
          icon="user-add"
          type="link"
          disabled={isCreated}
          onClick={() => setModalName('visible')}
        >
          {isCreated ? '已建档' : '建档'}
        </B>
        <B
          disabled={!isCreated}
          icon="pushpin"
          type="link"
          onClick={() => setModalName('signVisible')}
        >
          胎位标记
          </B>
        <B
          disabled={!isCreated}
          icon="pie-chart"
          type="link"
          onClick={() => setModalName('analysisVisible')}
        >
          电脑分析
          </B>
        <B
          disabled={!isCreated}
          icon="printer"
          type="link"
          onClick={() => setModalName('printVisible')}
        >
          报告
          </B>
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
        style={{
          position: 'absolute',
          bottom: 2 * fp,
          left: 2 * fp,
          zIndex: 99,
        }}
      >
        <Button
          icon={showSetting ? 'left' : 'right'}
          shape={showSetting ? 'circle' : null}
          style={{ boxShadow: '#aaa 3px 3px 5px 1px' }}
          type="primary"
          onClick={toggleTool}
        />
      </div>
      <CollectionCreateForm
        visible={modalName === 'visible'}
        onCancel={() => {
          handleCancel()
          setIsStopMonitorWhenCreated(false);
        }}
        isTodo={isTodo}
        docid={docid}
        starttime={startTime}
        bedname={bedname}
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
      <Analysis
        visible={modalName === 'analysisVisible'}
        onCancel={handleCancel}
        docid={docid}
        inpatientNO={inpatientNO}
        name={name}
        age={age}
        gestationalWeek={gestationalWeek}
        startTime={startTime}
      // inpatientNO={pregnancy.inpatientNO}
      // name={}
      />
      <PrintPreview
        visible={modalName === 'printVisible'}
        onCancel={handleCancel}
        docid={docid}
        inpatientNO={inpatientNO}
        name={name}
        age={age}
        gestationalWeek={gestationalWeek}
        startTime={startTime}
      />
      <Partogram
        visible={modalName === 'partogramVisible'}
        onCancel={handleCancel}
        bedname={bedname}
        pregnancyId={pregnancyId}
      />
      <ModalConfirm
        visible={modalName === 'confirmVisible'}
        bedname={bedname}
        isOffine={isOffline}
        isCreated={isCreated}
        isMonitor={isMonitor}
        onCancel={handleCancel}
        onOk={end}
        onCreate={redirectCreate}
      />
      <SignModal
        visible={modalName === 'signVisible'}
        isCreated={isCreated}
        isMonitor={isMonitor}
        onCancel={handleCancel}
        startTime={startTime}
        bedname={bedname}
        docid={docid}
        suit={suitObject.suit}
      />
    </>
  );
}

export default Toolbar