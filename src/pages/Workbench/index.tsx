import React, { useState, useEffect, useRef } from 'react';
import L from '@lianmed/lmg';
import { Skeleton, Card, Icon, Row, Col } from 'antd';
import { connect } from 'react-redux';
import './index.less';
const Home = props => {
  const { listLayout = [] } = props;
  const [loading, setLoading] = useState(true);
  const wrap = useRef(null);

  const list = Array(listLayout[0] * listLayout[1])
    .fill('')
    .map((_, index) => index);

  const [height, setHeight] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const [rec] = wrap.current.getClientRects();
    setHeight(rec.height);
  }, []);

  const itemSpan = 24 / listLayout[0];
  const itemHeight = height / listLayout[1] - 38 - 16;
  return (
    <div style={{ height: '100%', overflow: 'hidden' }} ref={wrap}>
      <Row gutter={4}>
        {list.map(_ => {
          return (
            <Col span={itemSpan} key={_}>
              <Card
                size="small"
                style={{ width: '100%', marginTop: 16, height: itemHeight }}
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

export default connect(({ setting }: any) => {
  return {
    listLayout: setting.listLayout,
  };
})(Home);
