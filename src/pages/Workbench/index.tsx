import React, { useRef, useEffect } from 'react';
import Empty from '@/components/Empty'
import { Row } from 'antd';
import { connect } from 'react-redux';
import Item from './Item';
import { IBed } from '@/types';
import useTodo, { IRemain } from "./useTodo";
import { event } from '@lianmed/utils';
import { BedStatus } from '@lianmed/lmg/lib/services/types';
interface IProps {
  pageItems: IBed[],
  [x: string]: any
}
const Home = (props: IProps) => {
  const { listLayout = [], pageItems, fullScreenId, dispatch, showTodo } = props;
  const wrap = useRef(null);
  const empty = useRef(null)
  const [todo] = useTodo(showTodo)

  const itemSpan = 24 / listLayout[0];
  const outPadding = 6;
  const contentHeight = parseInt(getComputedStyle(document.body).height) - 28 - 125
  const itemHeight = (contentHeight - outPadding * 2) / listLayout[1];
  const items: any[] = (showTodo ? todo : pageItems);

  useEffect(() => {
    const endCb = (unitId, status, isCreated) => status === BedStatus.Offline && dispatch({ type: 'list/appendOffline', unitId, })
    const closeCb = (unitId, status, isTodo, docid) => {
      console.log('close', unitId, status, isTodo, docid)
      if (isTodo) {
        event.emit('todo:discard', docid)
      } else {
        const cb = () => {
          dispatch({ type: 'list/appendDirty', unitId })
        }
        status === BedStatus.Stopped ? cb() : event.emit(`bedClose:${unitId}`, cb)
      }
    }
    const fullScreenCb = () => dispatch({ type: 'list/setState', payload: { fullScreenId: null } })
    event.on('bedEnd', endCb).on('bedClose', closeCb).on('bedFullScreen', fullScreenCb)

    return () => event.off('bedEnd', endCb).off('bedClose', closeCb).off('bedFullScreen', fullScreenCb)
  }, [])

  return (
    <div style={{ height: '100%' }} ref={wrap}>
      {
        <Row style={{ padding: outPadding, height: contentHeight }} >
          {items.length ? items.map((item: IBed | IRemain) => {
            const { data, bedname, prenatalVisit, bedno } = item;
            const { unitId } = (item as IBed)
            const { isTodo } = (item as IRemain)
            const safePregnancy = data.pregnancy || { age: null, name: null, inpatientNO: null, bedNO: null, id: null, GP: null }
            const safePrenatalVisit = prenatalVisit || { ctgexam: { startTime: null }, gestationalWeek: null, }
            return (
              <Item
                data={data as any}
                ismulti={data.ismulti}
                docid={data.docid}
                status={data.status}

                pregnancyId={safePregnancy.id}
                name={safePregnancy.name}
                age={safePregnancy.age}
                inpatientNO={safePregnancy.inpatientNO}
                GP={safePregnancy.GP}
                bedNO={safePregnancy.bedNO}

                startTime={safePrenatalVisit.ctgexam.startTime}
                gestationalWeek={safePrenatalVisit.gestationalWeek}

                bedname={bedname}
                unitId={unitId}
                isTodo={isTodo}
                key={item.id}
                itemHeight={itemHeight}
                itemSpan={itemSpan}
                outPadding={outPadding}
                fullScreenId={fullScreenId}
                deviceno={(item as IBed).deviceno}
                index={data.index}
                bedno={bedno}
              />
            );
          }) : (
              <div ref={empty} style={{ marginTop: 200, display: 'flex', justifyContent: 'center' }}>
                <Empty description="胎监工作站" />
              </div>
            )
          }
        </Row>
      }
    </div>
  );
};

export default connect(({ setting, list }: any) => {
  return {
    listLayout: setting.listLayout,
    pageItems: list.pageItems,
    fullScreenId: list.fullScreenId,
    showTodo: list.showTodo
  };
})(Home);
