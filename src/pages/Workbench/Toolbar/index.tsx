import Event from "@/components/Modal/Event";
import request from '@/utils/request';
import SettingStore from '@/utils/SettingStore';
import { VerticalAlignMiddleOutlined, FormOutlined, LoadingOutlined, PauseCircleOutlined, PieChartOutlined, PlayCircleOutlined, PrinterOutlined, PushpinOutlined, SoundOutlined, UserAddOutlined } from "@ant-design/icons";
import { WsService } from '@lianmed/lmg';
import { ICacheItem } from '@lianmed/lmg/lib/services/WsService';
import { MultiParamDisplay } from "@lianmed/pages/lib/Ctg/MultiParamDisplay";
import { event } from "@lianmed/utils";
import { Button, message } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import moment from 'moment';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import Analysis from '../Analysis';
import Shell from "../Analysis/Shell";
import PrintPreview from '../PrintPreview';
import { FetalItem } from "../types";
import CollectionCreateForm from './CollectionCreateForm';
import Jb from "./Jb";
import ModalConfirm from './ModalConfirm';
import SignModal from './SignModal';
import SoundModal from './SoundModal';
import BloodPressure from './Modals/BloodPressure'
export { RenderMaskIn } from './RenderMaskIn';
const cache = SettingStore.cache
const socket = WsService._this;

function Toolbar(props: FetalItem.IToolbarProps) {

  const [tocozeroLoading, setTocozeroLoading] = useState(false)
  const [volumeDataLoading, setVolumeDataLoading] = useState(false)
  const [isStopMonitorWhenCreated, setIsStopMonitorWhenCreated] = useState(false)
  const [startLoading, setStartLoading] = useState(false)
  const endCb = useRef(null)
  const [modalName, setModalName] = useState('')

  const [f0Pro_fetalnum, setF0Pro_fetalnum] = useState(0)
  const [f0Pro_cancelallocLoading, setF0Pro_cancelallocLoading] = useState(false)


  const {


    mutableSuit,
    itemData,
    setMaskVisible
  } = props




  const { bedname, prenatalVisit, bedno, isTodo, unitId } = itemData;
  const data: ICacheItem = itemData.data
  const safePregnancy = data.pregnancy || { pvId: null, age: null, name: null, inpatientNO: null, bedNO: null, id: null, GP: null, gestationalWeek: null }
  // const safePrenatalVisit = prenatalVisit || { gestationalWeek: null, }
  const docid = data.docid
  const startTime = data.starttime
  const {
    timeEndworkTipData,
    replaceProbeTipData,
    addProbeTipData,
    isF0Pro,
    isV3,
    hasToco,
    volumeData,
    is_include_tocozero,
    is_include_toco,
    disableStartWork,
    disableCreate,
    is_include_volume,
    is_include_blood_pressure,
    isWorking,
    isOffline,
    isStopped,
    isOfflineStopped,
    isUncreated,
  } = data

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

  const isCreated = !!pregnancyId;



  // useEffect(() => {
  //   const cb = getItemCbs(unitId)
  //   console.log('toolbar itemcb setMaskVisible', unitId, cb)

  //   if (cb) {
  //     console.log('toolbar itemcb setMaskVisible  ------------')

  //     setMaskVisible(true)
  //   }
  // }, [unitId])






  function setTocozero(isAutoCall = false) {
    setTocozeroLoading(true)
    socket[(isAutoCall || is_include_toco) ? 'setTocozero' : 'add_toco'](+deviceno, +bedno)
    setTimeout(() => {
      setTocozeroLoading(false)
      // message.success('设置成功')
    }, 1000);
  }
  const end = () => {
    _end(deviceno, bedno, docid)


    mutableSuit.current.then(s => s.setfetalposition('', '', ''))


    if (endCb.current) {
      endCb.current();
      endCb.current = null;
    }
  };



  useEffect(() => {

    if (isStopped || timeEndworkTipData || replaceProbeTipData || addProbeTipData) {
      console.log('oook')
      setMaskVisible(true)
    }
  }, [isStopped, timeEndworkTipData, replaceProbeTipData, addProbeTipData])


  const handleCancel = useCallback(() => setModalName(''), []);

  const showLoading = (id) => {
    event.emit(`showLoading`, id)
  }
  const start = () => {
    showLoading(docid);
    setStartLoading(true)
    setTocozero(true)
    setModalName('')
    socket.startwork(deviceno, bedno);
    setTimeout(() => {
      showLoading(null);
      setStartLoading(false)
    }, 1500);
  };
  const f0Pro_alloc = () => {
    socket.alloc(deviceno, bedno).then(({ res, fetalnum = 1 }) => {
      if (!res) {
        setF0Pro_fetalnum(fetalnum)
        // setModalName('soundMultiVisible')
        setMaskVisible(true)
      }

    })
  };
  const f0Pro_cancelalloc = () => {
    setF0Pro_cancelallocLoading(true)
    setTimeout(() => {
      setF0Pro_cancelallocLoading(false)
      setModalName('')
    }, 1200);
    socket.cancelalloc(deviceno, bedno).then(({ res, fetalnum = 1 }) => {

    })
  };

  const openVolumnModal = () => {
    // socket.getVolume(+deviceno, +bedno)
    // setVolumeDataLoading(true)
    // setTimeout(() => {
    //   setVolumeDataLoading(false)
    // }, 1200);

    setModalName('soundVisible')

  }


  // 未建档停止监，选择建档时，重定向打开建档窗口
  const redirectCreate = () => {
    setIsStopMonitorWhenCreated(true)
    setModalName('visible')
  };
  console.log('(isCreated && !pvId) ', isCreated, pvId, data, data.pregnancy, pregnancy)

  useEffect(() => {
    const onclose = cb => {
      endCb.current = cb;
      setModalName('confirmVisible');
    }
    const fn = () => {
      event.emit(`item_probetip_to_call:${unitId}`, () => {

        setMaskVisible(true)
      })
    }
    const openProbetip = (id) => {
      if (id === unitId) {
        fn()
      }
    }
    const closeKey = `item_close:${unitId}`
    const startKey = `item_start:${unitId}`
    const zeroKey = `item_zero:${unitId}`
    const probetipKey = `item_probetip_wait_to_call`

    fn()
    event
      .on(closeKey, onclose)
      .on(startKey, start)
      .on(zeroKey, setTocozero)
      .on(probetipKey, openProbetip)
    return () => {
      event
        .off(closeKey, onclose)
        .off(startKey, start)
        .off(zeroKey, setTocozero)
        .off(probetipKey, openProbetip)
    }
  }, [unitId, start, setTocozero])
  const B = (p: ButtonProps) => <Button style={{ padding: '0 6px' }} {...p} disabled={p.disabled || (isOfflineStopped && !pregnancyId)}>{p.children}</Button>
  return <>
    {
      (isF0Pro) ? (
        isStopped ? (
          <B
            icon={<PauseCircleOutlined />}
            loading={f0Pro_cancelallocLoading} type="link" onClick={f0Pro_cancelalloc}>
            取消
          </B>
        ) : (
            isWorking || isOffline ? (
              <B
                icon={<PauseCircleOutlined />}
                type="link" onClick={() => setModalName('confirmVisible')}>
                停止
              </B>
            ) : (
                <B disabled={disableCreate}
                  icon={<PlayCircleOutlined />}
                  type="link" onClick={f0Pro_alloc}>
                  <span>新建</span>
                </B>
              )
          )
      ) : (
          isWorking || isOffline ? (
            <B
              icon={<PauseCircleOutlined />}
              type="link" onClick={() => setModalName('confirmVisible')}>
              停止
            </B>
          ) : (
              <B disabled={!isStopped || !!disableStartWork}
                icon={<PlayCircleOutlined />}
                type="link" onClick={start}>
                {'开始'}
              </B>
            )
        )


    }
    {/* 停止状态下不可以建档，监护、离线都是可以建档的 */}

    <B
      icon={<UserAddOutlined />}
      type="link" disabled={(isCreated && !pvId) || isStopped || isUncreated || isOfflineStopped} onClick={() => {
        isCreated ? setModalName('jbVisible') : setModalName('visible')
      }}>
      {isCreated ? '解绑' : '建档'}
    </B>


    {
      !!isV3 || <B
        disabled={!isCreated || !isWorking || isStopped || isOfflineStopped}
        icon={<PushpinOutlined />}
        type="link"
        onClick={() => setModalName('signVisible')}
      >
        胎位
      </B>
    }
    {
      (!!cache.analysable && !isV3) && (
        <B
          disabled={!isCreated || isTodo}
          icon={<PieChartOutlined />}
          type="link"
          onClick={() => setModalName('analysisVisible')}
        >
          <span>分析</span>
        </B>
      )
    }

    {/* O */}
    <B
      disabled={!isCreated || isTodo}
      icon={<PrinterOutlined />}
      type="link"
      onClick={() => setModalName('printVisible')}
    >
      报告
      </B>
    <B
      icon={<FormOutlined />}
      type="link"
      disabled={!docid || isUncreated || isStopped || isOfflineStopped || !isCreated || isTodo}
      onClick={() => setModalName('eventVisible')}
    >
      事件
      </B>

    {
      data && data.ismulti && <B
        icon={<PieChartOutlined />}
        type="link"
        disabled={!docid || isUncreated || isStopped || isOfflineStopped}
        onClick={() => setModalName('multiParamVisible')}
      >
        趋势图
      </B>
    }

    {
      !!is_include_tocozero && (
        <B
          icon={tocozeroLoading ? <LoadingOutlined /> : <VerticalAlignMiddleOutlined />}
          type="link"
          onClick={(e) => setTocozero()}
          disabled={isUncreated || isStopped || isOfflineStopped}
        >
          {is_include_toco ? '调零' : '加入宫缩'}
        </B>
      )
    }
    {
      !!is_include_volume && <B
        // disabled={!isCreated}

        icon={volumeDataLoading ? <LoadingOutlined /> : <SoundOutlined />}
        type="link"
        onClick={openVolumnModal}
        disabled={!is_include_volume || isUncreated || isStopped || isOfflineStopped}
      >
        音量
      </B>
    }
    {
      !!is_include_blood_pressure && <B
        // disabled={!isCreated}

        // icon={volumeDataLoading ? <LoadingOutlined /> : <SoundOutlined />}
        icon={<svg fill="currentColor" className="anticon " viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14424" width="1em" height="1em"><path d="M388.096 437.248l48.128 27.648c7.168 4.096 17.408 2.048 21.504-6.144l20.48-34.816 1.024-1.024c40.96-4.096 86.016-36.864 114.688-87.04 29.696-50.176 34.816-105.472 18.432-143.36l14.336-25.6c4.096-7.168 2.048-17.408-6.144-21.504l-48.128-27.648c-7.168-4.096-17.408-2.048-21.504 6.144l-14.336 25.6c-40.96 4.096-86.016 36.864-114.688 87.04-29.696 50.176-34.816 105.472-18.432 143.36l-1.024 1.024-20.48 34.816c-4.096 7.168-2.048 17.408 6.144 21.504zM144.384 111.616c-16.384 0-22.528-4.096-34.816-16.384l-10.24-10.24c-6.144-7.168-19.456 6.144-12.288 12.288l10.24 10.24c14.336 14.336 16.384 18.432 15.36 35.84 0 17.408 14.336 31.744 31.744 31.744s31.744-14.336 31.744-31.744c0-18.432-14.336-31.744-31.744-31.744z m850.944 131.072c-17.408-17.408-40.96-27.648-67.584-27.648H660.48c3.072 15.36 4.096 31.744 2.048 48.128h265.216c13.312 0 25.6 5.12 33.792 14.336s14.336 20.48 14.336 33.792v8.192c0 13.312-5.12 25.6-14.336 33.792-9.216 9.216-20.48 14.336-33.792 14.336h-56.32v-23.552c0-11.264-4.096-21.504-12.288-28.672-7.168-7.168-17.408-11.264-28.672-11.264H655.36c-6.144 20.48-14.336 38.912-23.552 56.32-16.384 29.696-41.984 58.368-71.68 77.824V522.24c0 18.432 7.168 35.84 20.48 48.128 12.288 12.288 29.696 19.456 48.128 19.456h100.352v19.456c0 11.264 4.096 21.504 12.288 28.672 7.168 7.168 17.408 11.264 28.672 11.264h3.072c-5.12 57.344-36.864 103.424-83.968 138.24-59.392 41.984-142.336 65.536-231.424 65.536-78.848 0-153.6-35.84-206.848-119.808-20.48-31.744-36.864-70.656-50.176-116.736 33.792-22.528 74.752-38.912 111.616-54.272 9.216-3.072 16.384-6.144 17.408-7.168 16.384-7.168 32.768-14.336 48.128-24.576s28.672-23.552 39.936-40.96l-41.984-23.552c-7.168 11.264-16.384 19.456-25.6 26.624-11.264 8.192-24.576 14.336-37.888 19.456-12.288 5.12-14.336 6.144-17.408 7.168-34.816 13.312-72.704 28.672-105.472 48.128-10.24-51.2-15.36-109.568-15.36-176.128v-59.392h4.096c9.216 0 16.384-7.168 16.384-16.384v-35.84c20.48-7.168 38.912-18.432 54.272-33.792 25.6-25.6 41.984-62.464 41.984-101.376 0-39.936-16.384-75.776-41.984-101.376C219.136 16.384 183.296 0 144.384 0c-39.936 0-75.776 16.384-101.376 41.984C16.384 68.608 0 104.448 0 143.36c0 39.936 16.384 75.776 41.984 101.376 15.36 15.36 33.792 26.624 54.272 33.792v35.84c0 9.216 7.168 16.384 16.384 16.384h12.288v59.392c0 78.848 7.168 147.456 20.48 206.848-39.936 34.816-65.536 81.92-58.368 151.552 7.168 70.656 57.344 148.48 128 197.632 68.608 48.128 158.72 78.848 246.784 76.8 9.216 0 18.432-1.024 25.6-1.024 101.376-7.168 199.68-45.056 273.408-108.544 72.704-61.44 119.808-158.72 119.808-263.168h47.104c26.624 0 50.176-11.264 67.584-27.648 17.408-17.408 28.672-40.96 28.672-67.584V311.296c0-26.624-11.264-51.2-28.672-68.608z m-850.944-3.072c-26.624 0-50.176-10.24-67.584-27.648s-27.648-40.96-27.648-67.584 10.24-50.176 27.648-67.584 40.96-27.648 67.584-27.648 50.176 10.24 67.584 27.648 27.648 40.96 27.648 67.584-10.24 50.176-27.648 67.584c-17.408 16.384-40.96 27.648-67.584 27.648z m583.68 638.976c-65.536 56.32-153.6 90.112-244.736 96.256-8.192 1.024-16.384 1.024-23.552 1.024-77.824 1.024-157.696-26.624-219.136-68.608-59.392-41.984-101.376-107.52-107.52-162.816-4.096-37.888 7.168-67.584 26.624-91.136 13.312 40.96 29.696 76.8 49.152 106.496 63.488 99.328 153.6 142.336 247.808 142.336 98.304 0 191.488-26.624 259.072-74.752 59.392-43.008 99.328-103.424 104.448-177.152h13.312c0 89.088-41.984 174.08-105.472 228.352z m191.488-432.128h-92.16c-9.216 0-16.384 7.168-16.384 16.384v107.52c0 17.408-14.336 31.744-31.744 31.744h-4.096V460.8c1.024-25.6 21.504-46.08 47.104-47.104h104.448c17.408 0 33.792-5.12 48.128-13.312 0 18.432-8.192 46.08-55.296 46.08z" p-id="14425"></path></svg>}
        type="link"
        onClick={() => setModalName(('bloodVisible'))}
        disabled={!isWorking}
      >
        血压
      </B>
    }
    {/* {
      isF0Pro && !hasToco && (
        <>
          <B
            // disabled={!isCreated}

            icon={volumeDataLoading ? <LoadingOutlined /> : <SoundOutlined />}
            type="link"
            onClick={openVolumnModal}
            disabled={!is_include_volume}
          >
            <span>添加宫缩</span>
          </B>
        </>
      )
    } */}


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
    <Shell
      visible={modalName === 'multiParamVisible'}
      onCancel={handleCancel}
      docid={docid}
      inpatientNO={inpatientNO}
      name={name}
      age={age}
      gestationalWeek={gestationalWeek}
      startTime={startTime}
    >
      <MultiParamDisplay docid={docid} />
    </Shell>
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
      fetal_num={data.fetal_num}
    />
    <SoundModal
      deviceno={+deviceno}
      bedno={+bedno}
      volumeData={volumeData}
      visible={modalName === 'soundVisible'}
      onCancel={handleCancel}
      startTime={startTime}
      bedname={bedname}
      docid={docid}
      data={data}
    />
    {/* <SoundMultiModal
      fetel_num={f0Pro_fetalnum}
      deviceno={+deviceno}
      bedno={+bedno}
      volumeData={volumeData}
      visible={modalName === 'soundMultiVisible'}
      cancelLoading={f0Pro_cancelallocLoading}
      okLoading={startLoading}
      start={start}
      onCancel={f0Pro_cancelalloc}
      startTime={startTime}
      bedname={bedname}
      docid={docid}
    /> */}
    <Jb pregnancyId={pregnancyId} pvId={pvId} onCancel={handleCancel} visible={modalName === 'jbVisible'} />
    <Event docid={docid} visible={modalName === 'eventVisible'} onCancel={handleCancel} />
    <BloodPressure visible={modalName === 'bloodVisible'} onCancel={handleCancel} data={data} />
  </>;
}

export default memo(Toolbar)

export async function _end(device_no: string, bed_no: string, docid: string) {
  const socket = WsService._this
  const item = socket.getCacheItem({ device_no, bed_no })
  const isCreated = item && item.hasPregnancy
  if (isCreated) {
    // 已经建档 ,修改结束时间
    // 获取ctg曲线档案id，重新调用获取bedinfo
    // 与app的流程一致
    // app的结束 流程是 查bedinfo 获取 prental信息 然后 put prental-visits 接口成功调用ws endwork
    // 避免 多客户端 之间通信的保持问题。 即使当前设备离线 流程应该也不影响
    const res = await request.get(
      `/bedinfos?&documentno.equals=${docid}`);
    const d = res[0];

    if (d && d.id) {
      if (!d.prenatalVisit) {
        console.error('未能正确取得prenatalVisit!');
        return message.info('暂时无法停止监护，请稍后再试。');
      }
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
          }
        },
      });
    }
    else {
      return message.info('暂时无法停止监护，请稍后再试。');
    }
  }
  else {
    // 未建档提示简单保存或者放弃保存
    await request.get(`/ctg-exams-nosaving/${docid}`);
  }
  socket.endwork(device_no, bed_no);

}
