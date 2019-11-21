import React, { useRef } from 'react';
import Empty from '@/components/Empty'
import { Row } from 'antd';
import { connect } from 'react-redux';
import './index.less';
import Item from './Item';
// import { Spin } from 'antd';
import { IDevice } from '@/models/list';
import useTodo, { IRemain } from "./useTodo";

interface IProps {
  pageItems: IDevice[],
  [x: string]: any
}

const Home = (props: IProps) => {
  const { listLayout = [], pageItems, fullScreenId, dispatch, showTodo } = props;
  const [todo] = useTodo(showTodo)

  const wrap = useRef(null);
  // const [wrapRec, setWrapRec] = useState({ height: 0, width: 0 });
  const empty = useRef(null)

  const itemSpan = 24 / listLayout[0];
  const outPadding = 6;
  const contentHeight = parseInt(getComputedStyle(document.body).height) - 28 - 106
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
            {items.length ? items.map((item: IDevice | IRemain) => {
              // console.log('item', item)
              const { data, bedname } = item;
              const { unitId } = (item as IDevice)
              const { isTodo, note } = (item as IRemain)
              return (
                <Item
                  data={data}
                  bedname={bedname}
                  unitId={unitId}
                  isTodo={isTodo}
                  note={note}
                  key={item.id}
                  dataSource={item}
                  itemHeight={itemHeight}
                  itemSpan={itemSpan}
                  outPadding={outPadding}
                  fullScreenId={fullScreenId}
                  dispatch={dispatch}
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
