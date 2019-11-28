import React, { useRef, useEffect } from 'react';
import Empty from '@/components/Empty'
import { Row } from 'antd';
import { connect } from 'react-redux';
import './index.less';
import Item from './Item';
// import { Spin } from 'antd';
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
  const [todo] = useTodo(showTodo)

  const wrap = useRef(null);
  // const [wrapRec, setWrapRec] = useState({ height: 0, width: 0 });
  const empty = useRef(null)


  useEffect(() => {
    const endCb = (unitId, status, isCreated) => {
      status === BedStatus.Offline && dispatch({ type: 'list/appendOffline', unitId, });
    }
    const closeCb = (unitId, status, isTodo, note) => {
      if (isTodo) {
        event.emit('todo:discard', note)
      } else {
        const cb = () => {
          dispatch({
            type: 'list/appendDirty', unitId
          })
        }
        status === BedStatus.Stopped ? cb() : (
          event.emit(`bedClose:${unitId}`, cb)
        )
      }
    }
    const fullScreenCb = (unitId) => {
      dispatch({ type: 'list/setState', payload: { fullScreenId: null } });
    }
    event.on('bedEnd', endCb).on('bedClose', closeCb).on('bedFullScreen', fullScreenCb)
    return () => {
      event.off('bedEnd', endCb).off('bedClose', closeCb).off('bedFullScreen', fullScreenCb)
    }
  }, [])

  const itemSpan = 24 / listLayout[0];
  const outPadding = 6;
  const contentHeight = parseInt(getComputedStyle(document.body).height) - 28 - 125
  const itemHeight =
    (contentHeight - outPadding * 2) / listLayout[1];
  const items: any[] = (showTodo ? todo : pageItems);

  // useLayoutEffect(() => {
  //   if (empty.current) {
  //     const e = (empty.current) as HTMLDivElement
  //     const h1 = document.querySelector('h1')
  //     const clone = h1.cloneNode(true) as HTMLDivElement
  //     Object.assign(clone.style, getComputedStyle(h1), { margin: 'auto' })
  //     e.replaceChild(clone, e.firstElementChild)
  //   }

  // })
  return (
    <div style={{ height: '100%' }} ref={wrap}>
      {
        (
          <Row style={{ padding: outPadding, height: contentHeight }} >
            {items.length ? items.map((item: IBed | IRemain) => {
              // console.log('item', item)
              const { data, bedname, prenatalVisit, bedno } = item;
              const { unitId } = (item as IBed)
              const { isTodo, note } = (item as IRemain)
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
                  note={note}
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
        )
      }
    </div>
  );
};

export default connect(({ setting, list, ws }: any) => {
  // console.log('index connect')
  const { data: datacache } = ws
  return {
    listLayout: setting.listLayout,
    pageItems: list.pageItems.map(_ => {
      const data = (datacache as Map<string, any>).get(_.unitId);
      return {
        ..._, data, status: data && data.status
      }
    }),
    fullScreenId: list.fullScreenId,
    showTodo: list.showTodo
    // datacache: ws.data,
  };
})(Home);
