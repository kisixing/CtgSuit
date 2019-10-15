import React, { useRef, useEffect, useState } from 'react';
import { Row } from 'antd';
import { connect } from 'react-redux';
import './index.less';
import Item from './Item';
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
    event.on('workbench:toggle_completed', status => {
      setShowCompleted(status)
      status && request.get('/').finally(() => {
        setCompletedData(Array(6).fill({}))
      })
    })
  }, []);
  const itemSpan = 24 / listLayout[0];
  const outPadding = 6;
  const itemHeight =
    (parseInt(getComputedStyle(document.body).height) - 28 - 106 - outPadding * 2) / listLayout[1];
  return (
    <div style={{ height: '100%' }} ref={wrap}>
      <Row style={{ padding: outPadding }}>
        {((showCompleted ? completedData : pageItems) as IDevice[]).map(item => {
          console.log('item',item)
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
