import React, { useRef, useEffect, useState } from 'react';
import { Row } from 'antd';
import { connect } from 'react-redux';
import './index.less';
import Item from './Item';
import { Spin } from 'antd';
import { IDevice } from '@/models/list';
import { event } from "@lianmed/utils";
import request from "@lianmed/request";
const Home = props => {
  const { listLayout = [], pageItems, fullScreenId, dispatch } = props;
  const wrap = useRef(null);
  const [showCompleted, setShowCompleted] = useState(false)
  const [completedData, setCompletedData] = useState([])
  // const [wrapRec, setWrapRec] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const cb = status => {
      setShowCompleted(status)
      status && request.get('/').finally(() => {
        setCompletedData(Array(6).fill({}))
      })
    }
    event.on('workbench:toggle_completed', cb)
    return () => {
      event.off('workbench:toggle_completed', cb)
    }
  }, []);
  const itemSpan = 24 / listLayout[0];
  const outPadding = 6;
  const contentHeight = parseInt(getComputedStyle(document.body).height) - 28 - 106
  const itemHeight =
    (contentHeight - outPadding * 2) / listLayout[1];
  const items = (showCompleted ? completedData : pageItems) as IDevice[];
  return (
    <div style={{ height: '100%' }} ref={wrap}>
      <Spin spinning={items.length === 0} size="large" >

        <Row style={{ padding: outPadding, height: contentHeight }}>
          {items.map(item => {
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
    // datacache: ws.data,
  };
})(Home);
