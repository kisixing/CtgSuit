import React, { useRef, useEffect, useState } from 'react';
import { Row } from 'antd';
import { connect } from 'react-redux';
import './index.less';
import Item from './Item';
import { Spin } from 'antd';
import { IDevice } from '@/models/list';
import useTodo, { IRemain } from "./useTodo";

interface IProps {
  pageItems: IDevice[],
  [x: string]: any
}


const Home = (props: IProps) => {
  const { listLayout = [], pageItems, fullScreenId, dispatch, showTodo } = props;
  const [todo, todoLoading] = useTodo(showTodo)

  const wrap = useRef(null);
  // const [wrapRec, setWrapRec] = useState({ height: 0, width: 0 });


  const itemSpan = 24 / listLayout[0];
  const outPadding = 6;
  const contentHeight = parseInt(getComputedStyle(document.body).height) - 28 - 106
  const itemHeight =
    (contentHeight - outPadding * 2) / listLayout[1];
  const items: any[] = (showTodo ? todo : pageItems);

  return (
    <div style={{ height: '100%' }} ref={wrap}>
      <Spin spinning={pageItems.length === 0 || todoLoading} size="large" >
        <Row style={{ padding: outPadding, height: contentHeight }}>
          {items.map((item: IDevice | IRemain) => {
            // console.log('item', item)
            return (
              <Item
                key={item.id}
                dataSource={item}
                itemHeight={itemHeight}
                itemSpan={itemSpan}
                outPadding={outPadding}
                fullScreenId={fullScreenId}
                dispatch={dispatch}
              />
            );
          })}
        </Row>
      </Spin>

    </div>

  );
};

export default connect(({ setting, list, ws }: any) => {
  console.log('index connect')

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
