// import Event from "@/components/Modal/Event";
// import request from '@/utils/request';
// import { PauseCircleOutlined, PlayCircleOutlined, UserAddOutlined, PushpinOutlined, PieChartOutlined, PrinterOutlined, LoadingOutlined, ControlOutlined, SoundOutlined, FormOutlined } from "@ant-design/icons";
// import { BedStatus, ICacheItem } from '@lianmed/lmg/lib/services/WsService';
// import { MultiParamDisplay } from "@lianmed/pages/lib/Ctg/MultiParamDisplay";
// import { event } from "@lianmed/utils";
// import { Button, message, Modal } from 'antd';
// import { ButtonProps } from 'antd/lib/button';
// import moment from 'moment';
// import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
// import Analysis from '../Analysis';
// import Shell from "../Analysis/Shell";
// import PrintPreview from '../PrintPreview';
// import { FetalItem } from "../types";
// import CollectionCreateForm from './CollectionCreateForm';
// import ReplaceProbe from './ReplaceProbe';
// import Jb from "./Jb";
// import ModalConfirm from './ModalConfirm';
// import SignModal from './SignModal';
// import SoundModal from './SoundModal';
// import SoundMultiModal from './SoundMultiModal';
// import SettingStore from '@/utils/SettingStore';
// import { WsService } from '@lianmed/lmg';
// const cache = SettingStore.cache
// const socket = WsService._this;

// function Toolbar(props: FetalItem.IToolbarProps) {

//   const [tocozeroLoading, setTocozeroLoading] = useState(false)
//   const [volumeDataLoading, setVolumeDataLoading] = useState(false)
//   const [isStopMonitorWhenCreated, setIsStopMonitorWhenCreated] = useState(false)
//   const [startLoading, setStartLoading] = useState(false)
//   const endCb = useRef(null)
//   const [modalName, setModalName] = useState('')

//   const [f0Pro_fetalnum, setF0Pro_fetalnum] = useState(0)
//   const [f0Pro_cancelallocLoading, setF0Pro_cancelallocLoading] = useState(false)


//   const {


//     mutableSuit,
//     itemData,
//   } = props




//   const { bedname, prenatalVisit, bedno, isTodo, unitId } = itemData;
//   const data: ICacheItem = itemData.data
//   const safePregnancy = data.pregnancy || { pvId: null, age: null, name: null, inpatientNO: null, bedNO: null, id: null, GP: null, gestationalWeek: null }
//   // const safePrenatalVisit = prenatalVisit || { gestationalWeek: null, }
//   const docid = data.docid
//   const startTime = data.starttime
//   const status = data.status
//   const isF0Pro = data.isF0Pro
//   const hasToco = data.hasToco

//   const volumeData = data.volumeData
//   const is_include_tocozero = data.is_include_tocozero
//   const is_include_toco = data.is_include_toco
//   const disableStartWork = data.disableStartWork
//   const is_include_volume = data.is_include_volume
//   const deviceno = itemData.deviceno

//   const pregnancy = safePregnancy

//   const {
//     inpatientNO,
//     name,
//     gestationalWeek,
//     age,
//     id: pregnancyId,
//     pvId
//   } = pregnancy










//   const isWorking = status === BedStatus.Working;
//   const isOffline = status === BedStatus.Offline;
//   const isStopped = status === BedStatus.Stopped
//   const isOfflineStopped = status === BedStatus.OfflineStopped;
//   const isUncreated = status === BedStatus.Uncreated;
//   const isCreated = !!pregnancyId;

//   function setTocozero(isAutoCall = false) {
//     setTocozeroLoading(true)
//     socket[(isAutoCall || is_include_toco) ? 'setTocozero' : 'add_toco'](+deviceno, +bedno)
//     setTimeout(() => {
//       setTocozeroLoading(false)
//       // message.success('设置成功')
//     }, 1000);
//   }
//   const end = () => {
//     _end(deviceno, bedno, docid)


//     mutableSuit.current && mutableSuit.current.setfetalposition('', '', '');


//     if (endCb.current) {
//       endCb.current();
//       endCb.current = null;
//     }
//   };
//   useEffect(() => {
//     const onclose = cb => {
//       endCb.current = cb;
//       setModalName('confirmVisible');
//     }
//     const closeKey = `item_close:${unitId}`


//     event
//       .on(closeKey, onclose)
//     return () => {
//       event
//         .off(closeKey, onclose)
//     }
//   }, [unitId])





//   const handleCancel = useCallback(() => setModalName(''), []);

//   const showLoading = (id) => {
//     event.emit(`showLoading`, id)
//   }
//   const start = () => {
//     showLoading(docid);
//     setStartLoading(true)
//     setTocozero(true)
//     setModalName('')
//     socket.startwork(deviceno, bedno);
//     setTimeout(() => {
//       showLoading(null);
//       setStartLoading(false)
//     }, 1500);
//   };
//   const f0Pro_alloc = () => {
//     socket.alloc(deviceno, bedno).then(({ res, fetalnum = 1 }) => {
//       if (!res) {
//         setF0Pro_fetalnum(fetalnum)
//         setModalName('soundMultiVisible')
//       }

//     })
//   };
//   const f0Pro_cancelalloc = () => {
//     setF0Pro_cancelallocLoading(true)
//     setTimeout(() => {
//       setF0Pro_cancelallocLoading(false)
//       setModalName('')
//     }, 1200);
//     socket.cancelalloc(deviceno, bedno).then(({ res, fetalnum = 1 }) => {

//     })
//   };

//   const openVolumnModal = () => {
//     socket.getVolume(+deviceno, +bedno)
//     setVolumeDataLoading(true)
//     setTimeout(() => {
//       setVolumeDataLoading(false)
//       setModalName(isF0Pro ? 'soundMultiVisible' : 'soundVisible')
//     }, 1200);
//   }


//   // 未建档停止监，选择建档时，重定向打开建档窗口
//   const redirectCreate = () => {
//     setIsStopMonitorWhenCreated(true)
//     setModalName('visible')
//   };



//   return <>


//     <CollectionCreateForm
//       visible={modalName === 'visible'}
//       onCancel={() => {
//         handleCancel();
//         setIsStopMonitorWhenCreated(false);
//       }}
//       isTodo={isTodo}
//       docid={docid}
//       starttime={startTime}
//       bedname={bedname}
//       isStopMonitorWhenCreated={isStopMonitorWhenCreated}
//       onCreated={res => {
//         // setState({ isCreated: true });
//         event.emit('newArchive', res);
//         // 完成绑定后判断是否停止监护工作（未建档停止监护时补充建档内容）
//         if (isStopMonitorWhenCreated) {
//           end();
//           setIsStopMonitorWhenCreated(false);
//         }
//       }}
//     />
//     <ReplaceProbe
//       unitId={unitId}
//       bedname={bedname}
//       deviceno={deviceno}
//       bedno={bedno}
//       end={end}

//     />
//     <Analysis
//       visible={modalName === 'analysisVisible'}
//       onCancel={handleCancel}
//       docid={docid}
//       inpatientNO={inpatientNO}
//       name={name}
//       age={age}
//       gestationalWeek={gestationalWeek}
//       startTime={startTime}
//     // inpatientNO={pregnancy.inpatientNO}
//     // name={}
//     />
//     <Shell
//       visible={modalName === 'multiParamVisible'}
//       onCancel={handleCancel}
//       docid={docid}
//       inpatientNO={inpatientNO}
//       name={name}
//       age={age}
//       gestationalWeek={gestationalWeek}
//       startTime={startTime}
//     >
//       <MultiParamDisplay docid={docid} />
//     </Shell>
//     <PrintPreview
//       visible={modalName === 'printVisible'}
//       onCancel={handleCancel}
//       docid={docid}
//       inpatientNO={inpatientNO}
//       name={name}
//       age={age}
//       gestationalWeek={gestationalWeek}
//       startTime={startTime}
//     />

//     <ModalConfirm
//       visible={modalName === 'confirmVisible'}
//       bedname={bedname}
//       isOffine={isOffline}
//       isCreated={isCreated}
//       isMonitor={isWorking}
//       onCancel={handleCancel}
//       onOk={end}
//       onCreate={redirectCreate}
//     />
//     <SignModal
//       visible={modalName === 'signVisible'}
//       isCreated={isCreated}
//       isMonitor={isWorking}
//       onCancel={handleCancel}
//       startTime={startTime}
//       bedname={bedname}
//       docid={docid}
//       suit={mutableSuit}
//       fetal_num={data.fetal_num}
//     />
//     <SoundModal
//       deviceno={+deviceno}
//       bedno={+bedno}
//       volumeData={volumeData}
//       visible={modalName === 'soundVisible'}
//       isCreated={isCreated}
//       isMonitor={isWorking}
//       onCancel={handleCancel}
//       startTime={startTime}
//       bedname={bedname}
//       docid={docid}
//     />
//     <SoundMultiModal
//       fetel_num={f0Pro_fetalnum}
//       deviceno={+deviceno}
//       bedno={+bedno}
//       volumeData={volumeData}
//       visible={modalName === 'soundMultiVisible'}
//       isCreated={isCreated}
//       cancelLoading={f0Pro_cancelallocLoading}
//       okLoading={startLoading}
//       start={start}
//       onCancel={f0Pro_cancelalloc}
//       startTime={startTime}
//       bedname={bedname}
//       docid={docid}
//     />
//     <Jb pregnancyId={pregnancyId} pvId={pvId} onCancel={handleCancel} visible={modalName === 'jbVisible'} />
//     <Event docid={docid} visible={modalName === 'eventVisible'} onCancel={handleCancel} />
//   </>;
// }

// export default memo(Toolbar)

// export async function _end(device_no: string, bed_no: string, docid: string) {
//   const socket = WsService._this
//   const item = socket.getCacheItem({ device_no, bed_no })
//   console.log('end', item)
//   const isCreated = item && item.hasPregnancy
//   if (isCreated) {
//     // 已经建档 ,修改结束时间
//     // 获取ctg曲线档案id，重新调用获取bedinfo
//     // 与app的流程一致
//     // app的结束 流程是 查bedinfo 获取 prental信息 然后 put prental-visits 接口成功调用ws endwork
//     // 避免 多客户端 之间通信的保持问题。 即使当前设备离线 流程应该也不影响
//     const res = await request.get(
//       `/bedinfos?&documentno.equals=${docid}`);
//     const d = res[0];

//     if (d && d.id) {
//       if (!d.prenatalVisit) {
//         console.error('未能正确取得prenatalVisit!');
//         return message.info('暂时无法停止监护，请稍后再试。');
//       }
//       const prenatalVisit = d['prenatalVisit'];
//       const pregnancyId = d['pregnancy']['id'];
//       await request.put(`/prenatal-visits`, {
//         data: {
//           id: prenatalVisit.id,
//           pregnancy: { id: pregnancyId },
//           ctgexam: {
//             ...prenatalVisit.ctgexam,
//             startTime: moment(prenatalVisit.ctgexam.startTime),
//             endTime: moment(),
//             note: d.documentno,
//           }
//         },
//       });
//     }
//     else {
//       return message.info('暂时无法停止监护，请稍后再试。');
//     }
//   }
//   else {
//     // 未建档提示简单保存或者放弃保存
//     await request.get(`/ctg-exams-nosaving/${docid}`);
//   }
//   socket.endwork(device_no, bed_no);

// }