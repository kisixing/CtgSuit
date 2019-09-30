import React, { useState, useEffect, useRef } from 'react';
import { Row } from 'antd';
import { connect } from 'react-redux';
import './index.less';
import Item from './Item';
const Home = props => {
  const { listLayout = [], pageItems, dispatch } = props;
  const wrap = useRef(null);

  const [wrapRec, setWrapRec] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const [rec] = wrap.current.getClientRects();
    setWrapRec(rec);
  }, []);

  const itemSpan = 24 / listLayout[0];
  const outPadding = 12;
  const itemHeight =
    (wrapRec.height - outPadding * 2) / listLayout[1] - outPadding * 2 - 2 - 37 * 1;
  return (
    <div style={{ height: '100%', overflow: 'hidden', background: '#fff' }} ref={wrap}>
      <Row style={{ padding: outPadding }}>
        {pageItems.map(_ => {
          return (
            <Item
              key={_.id}
              {..._}
              itemHeight={itemHeight}
              itemSpan={itemSpan}
              outPadding={outPadding}
            />
          );
        })}
      </Row>
    </div>
  );
};

export default connect(({ setting, list }: any) => {
  return {
    listLayout: setting.listLayout,
    pageItems: list.pageItems,
  };
})(Home);
