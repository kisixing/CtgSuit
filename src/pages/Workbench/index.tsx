import React, { useState, useEffect, useRef } from 'react';
import L from '@lianmed/lmg';
import { Skeleton, Card, Icon, Row, Col } from 'antd';
import { connect } from 'react-redux';
import './index.less';
const Home = props => {
  const { listLayout = [], pageItems, dispatch } = props;

  console.log(pageItems);
  const [loading, setLoading] = useState(true);
  const wrap = useRef(null);

  const list = Array(listLayout[0] * listLayout[1])
    .fill('')
    .map((_, index) => index);

  const [height, setHeight] = useState(0);
  useEffect(() => {
    dispatch({ type: 'list/getlist' });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const [rec] = wrap.current.getClientRects();
    setHeight(rec.height);
  }, []);

  const itemSpan = 24 / listLayout[0];
  const itemHeight = height / listLayout[1] - 38;
  return (
    <div style={{ height: '100%', overflow: 'hidden' }} ref={wrap}>
      <Row>
        {pageItems.map(({ id, name, age, index }) => {
          return (
            <Col span={itemSpan} key={id} style={{ border: '1px solid #999' }}>
              <Card
                title={
                  <div>
                    姓名：{name} 年龄：{age}
                  </div>
                }
                size="small"
                style={{ width: '100%', height: itemHeight }}
                loading={loading}
                bodyStyle={{ width: '100%', height: '100%' }}
                actions={[
                  <Icon type="setting" key="setting" />,
                  <Icon type="edit" key="edit" />,
                  <Icon type="ellipsis" key="ellipsis" />,
                  <Icon type="setting" key="setting" />,
                  <Icon type="edit" key="edit" />,
                  <Icon type="ellipsis" key="ellipsis" />,
                ]}
              >
                <Skeleton loading={loading} avatar active>
                  <L data={null}></L>
                </Skeleton>
              </Card>
            </Col>
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
