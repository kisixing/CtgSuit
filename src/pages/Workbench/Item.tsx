// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import ReactDOM from 'react-dom';
// import { BedStatus, ICacheItem, ICacheItemPregnancy } from "@lianmed/lmg/lib/services/WsService";

// import { Col } from 'antd';
// import { Ctg_Item } from "@lianmed/pages";
// import { event } from "@lianmed/utils";

// type clickCb = ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void)

// interface IProps {
//   loading: boolean
//   onClose: (data: any) => void
//   itemData: any
//   children: React.ReactNode
//   startTime: string
//   pregnancy: ICacheItemPregnancy

//   data: ICacheItem
//   bedname: string
//   unitId: string
//   isTodo: boolean
//   ismulti: boolean
//   docid: string
//   status: BedStatus

//   outPadding: number
//   fullScreenId: string
//   itemHeight: number
//   itemSpan: number
// }


// const WorkbenchItem = (props: IProps) => {
//   const { itemData, onClose, loading = false, fullScreenId, itemHeight, itemSpan, outPadding, data, bedname, isTodo, docid, ismulti, status, unitId, ...others } = props;
//   let { startTime, pregnancy } = props


//   let w: any = window
//   const k = `spinfo_${unitId}`
//   const c = w[k] || (w[k] = {})
//   if ([BedStatus.Stopped, BedStatus.OfflineStopped].includes(status)) {
//     startTime = c.startTime
//     pregnancy = c.pregnancy || {}
//   } else {
//     Object.assign(c, { pregnancy: { ...pregnancy, pvId: null }, startTime })
//   }

//   // -------------------
//   const ref = useRef(null)
//   const fullScreen: clickCb = useCallback(
//     (e) => {
//       const el = ReactDOM.findDOMNode(ref.current);
//       if (document.fullscreenElement) {
//         document.exitFullscreen();
//       } else {
//         el.requestFullscreen();
//       }
//     }, []
//   )
//   useEffect(() => {
//     if (fullScreenId === unitId) {
//       fullScreen(null);
//       event.emit('bedFullScreen', unitId)
//     }
//   }, [fullScreenId])
//   return (
//     <Col
//       span={itemSpan}
//       ref={ref}
//       style={{ padding: outPadding, height: itemHeight, background: `var(--theme-light-color)`, position: 'relative' }}
//     >
//       <Ctg_Item
//         themeColor='var(--theme-color)'
//         startTime={startTime}
//         name={pregnancy.name}
//         age={pregnancy.age as any}
//         bedname={bedname}
//         status={status}
//         data={data}
//         onDoubleClick={fullScreen}
//         loading={loading}
//         bedNO={pregnancy.bedNO}
//         GP={pregnancy.GP}
//         gestationalWeek={pregnancy.gestationalWeek}
//         onClose={() => onClose(itemData)}
//       >
//         {
//           props.children
//         }
//       </Ctg_Item>

//     </Col >
//   );
// }
// export default WorkbenchItem;
