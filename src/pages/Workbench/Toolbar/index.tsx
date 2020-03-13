import React, { useState, useEffect, useRef, memo } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Button, message } from 'antd';
import moment from 'moment';
import { event } from "@lianmed/utils";
import request from '@/utils/request';
import CollectionCreateForm from './CollectionCreateForm';
import Analysis from '../Analysis';
import PrintPreview from '../PrintPreview';
import ModalConfirm from './ModalConfirm';
import SignModal from './SignModal';
import SoundModal from './SoundModal';
import { WsService } from '@lianmed/lmg';
import { BedStatus } from '@lianmed/lmg/lib/services/WsService';
import { FetalItem } from "../types";
import { ButtonProps } from 'antd/lib/button';
import { useJb } from "./useJb";

const socket = WsService._this;

function Toolbar(props: FetalItem.IToolbarProps) {

  const [tocozeroLoading, setTocozeroLoading] = useState(false)
  const [volumeDataLoading, setVolumeDataLoading] = useState(false)
  const [isStopMonitorWhenCreated, setIsStopMonitorWhenCreated] = useState(false)
  const endCb = useRef(null)
  const [modalName, setModalName] = useState('')



  const onclose = cb => {
    endCb.current = cb;
    setModalName('confirmVisible');
  };
  const {


    mutableSuit,
    itemData,
  } = props





  const { data, bedname, prenatalVisit, bedno, isTodo,unitId } = itemData;

  const safePregnancy = data.pregnancy || { pvId: null, age: null, name: null, inpatientNO: null, bedNO: null, id: null, GP: null, gestationalWeek: null }
  // const safePrenatalVisit = prenatalVisit || { gestationalWeek: null, }
  const docid = data.docid
  const startTime = data.starttime
  const status = data.status

  const volumeData = data.volumeData
  const is_include_tocozero = data.is_include_tocozero
  const is_include_volume = data.is_include_volume
  const deviceno = itemData.deviceno
  const pregnancy = safePregnancy

  const {
    inpatientNO,
    name,
    gestationalWeek,
    age,
    id: pregnancyId,
    pvId
  } = pregnancy










  const { jbLoading, jb } = useJb(pregnancyId, pvId)
  const isWorking = status === BedStatus.Working;
  const isOffline = status === BedStatus.Offline;
  const isStopped = status === BedStatus.Stopped;
  const isOfflineStopped = status === BedStatus.OfflineStopped;
  const isCreated = !!pregnancyId;

  function setTocozero() {
    setTocozeroLoading(true)
    socket.setTocozero(+deviceno, +bedno)
    setTimeout(() => {
      setTocozeroLoading(false)
      message.success('设置成功')
    }, 1000);
  }

  useEffect(() => {
    event.on(`bedClose:${unitId}`, onclose)
    return () => {
      event.off(`bedClose:${unitId}`, onclose)
    }
  }, [unitId])





  const handleCancel = () => setModalName('');

  const showLoading = (id) => {
    event.emit(`showLoading`, id)
  }
  const start = () => {
    showLoading(docid);
    socket.startwork(deviceno, bedno);
    setTimeout(() => {
      showLoading(null);
    }, 1500);
  };

  const end = async () => {
    if (isCreated || isStopMonitorWhenCreated) {
      // 已经建档 ,修改结束时间
      // 获取ctg曲线档案id，重新调用获取bedinfo
      // 与app的流程一致
      // app的结束 流程是 查bedinfo 获取 prental信息 然后 put prental-visits 接口成功调用ws endwork
      // 避免 多客户端 之间通信的保持问题。 即使当前设备离线 流程应该也不影响

      const res = await request.get(
        `/bedinfos?&documentno.equals=${docid}`,
      );
      const d = res[0];
      if (!d.prenatalVisit) {
        console.error('未能正确取得prenatalVisit!');
        return message.info('暂时无法停止改监护，请稍后再试。');
      }
      if (d && d.id) {
        const prenatalVisit = d['prenatalVisit'];
        const pregnancyId = d['pregnancy']['id'];
        await request.put(`/prenatal-visits`, {
          data: {
            id: prenatalVisit.id,
            pregnancy: { id: pregnancyId },
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



  const B = (p: ButtonProps) => <Button style={{ padding: '0 8px' }} {...p} disabled={p.disabled || (isOfflineStopped && !pregnancyId)}>{p.children}</Button>
  return <>
    {isWorking || isOffline ? (
      <B icon={<LegacyIcon type="pause-circle" />} type="link" onClick={() => setModalName('confirmVisible')}>
        停止监护
        </B>
    ) : (
        <B disabled={!isStopped} icon={<LegacyIcon type="play-circle" />} type="link" onClick={start}>
          开始监护
        </B>
      )}
    {/* 停止状态下不可以建档，监护、离线都是可以建档的 */}

    <B icon={<LegacyIcon type={jbLoading ? 'loading' : 'user-add'} />} type="link" disabled={(isCreated && !pvId) || isStopped} onClick={() => {
      isCreated ? jb() : setModalName('visible')
    }}>
      {isCreated ? '解绑' : '建档'}
    </B>


    <B
      disabled={!isCreated}
      icon={<LegacyIcon type="pushpin" />}
      type="link"
      onClick={() => setModalName('signVisible')}
    >
      胎位标记
      </B>
    {/* <B
        disabled={!isCreated}
        icon="pie-chart"
        type="link"
        onClick={() => setModalName('analysisVisible')}
      >
        电脑分析
      </B> */}

    {/* O */}
    <B
      disabled={!isCreated}
      icon={<LegacyIcon type="printer" />}
      type="link"
      onClick={() => setModalName('printVisible')}
    >
      报告
      </B>
    {
      !!is_include_tocozero && <B
        disabled={!is_include_tocozero}
        icon={<LegacyIcon type={tocozeroLoading ? 'loading' : 'control'} />}
        type="link"
        onClick={setTocozero}
      >
        宫缩调零
      </B>
    }
    {
      !!is_include_volume && <B
        // disabled={!isCreated}

        icon={<LegacyIcon type={volumeDataLoading ? 'loading' : 'sound'} />}
        type="link"
        onClick={() => {
          socket.getVolume(+deviceno, +bedno)
          setVolumeDataLoading(true)
          setTimeout(() => {
            setVolumeDataLoading(false)
            setModalName('soundVisible')
          }, 1200);
        }}
        disabled={!is_include_volume}
      >
        音量调节
      </B>
    }


    <CollectionCreateForm
      visible={modalName === 'visible'}
      onCancel={() => {
        handleCancel();
        setIsStopMonitorWhenCreated(false);
      }}
      isTodo={isTodo}
      docid={docid}
      starttime={startTime}
      bedname={bedname}
      isStopMonitorWhenCreated={isStopMonitorWhenCreated}
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

    <ModalConfirm
      visible={modalName === 'confirmVisible'}
      bedname={bedname}
      isOffine={isOffline}
      isCreated={isCreated}
      isMonitor={isWorking}
      onCancel={handleCancel}
      onOk={end}
      onCreate={redirectCreate}
    />
    <SignModal
      visible={modalName === 'signVisible'}
      isCreated={isCreated}
      isMonitor={isWorking}
      onCancel={handleCancel}
      startTime={startTime}
      bedname={bedname}
      docid={docid}
      suit={mutableSuit}
    />
    <SoundModal
      deviceno={+deviceno}
      bedno={+bedno}
      volumeData={volumeData}
      visible={modalName === 'soundVisible'}
      isCreated={isCreated}
      isMonitor={isWorking}
      onCancel={handleCancel}
      startTime={startTime}
      bedname={bedname}
      docid={docid}
    />
  </>;
}

export default memo(Toolbar)