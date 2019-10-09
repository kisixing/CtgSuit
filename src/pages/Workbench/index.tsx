import React, { useRef } from 'react';
import { Row } from 'antd';
import { connect } from 'react-redux';
import './index.less';
import Item from './Item';
import { IDevice } from '@/models/list';

const Home = props => {
  const { listLayout = [], pageItems, fullScreenId, dispatch, datacache } = props;
  const wrap = useRef(null);

  // const [wrapRec, setWrapRec] = useState({ height: 0, width: 0 });

  // useEffect(() => {
  //   const [rec] = wrap.current.getClientRects();
  //   setWrapRec(rec);
  // }, []);
  const itemSpan = 24 / listLayout[0];
  const outPadding = 6;
  const itemHeight =
    (parseInt(getComputedStyle(document.body).height) - 36 - 106 - outPadding * 2) / listLayout[1];
  return (
    <div style={{ height: '100%', overflow: 'hidden' }} ref={wrap}>
      <Row style={{ padding: outPadding }}>
        {(pageItems as IDevice[]).map(item => {
          const data = (datacache as Map<string, any>).get(item.unitId);
          return (
            <Item
              key={item.id}
              dataSource={{ ...item, data, status: data && data.status }}
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
  return {
    listLayout: setting.listLayout,
    pageItems: list.pageItems,
    fullScreenId: list.fullScreenId,
    datacache: ws.data,
  };
})(Home);
