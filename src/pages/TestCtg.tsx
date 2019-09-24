import React, { useState, useEffect, useRef } from 'react';
import L from '@lianmed/lmg';
const A = () => {
  return <L data={null}></L>;
};
import { Skeleton, Switch, Card, Icon, Avatar, Row, Col } from 'antd';
const R = 2;
const C = 2;
const list = [1, 2, 3, 4, 5, 6];
export default () => {
  const [loading, setLoading] = useState(true);
  const wrap = useRef(null);

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

  return (
    <div style={{ height: '100%', overflow: 'hidden' }} ref={wrap}>
      <Row gutter={10}>
        {list.map(_ => {
          return (
            <Col span={12} key={_}>
              <Card
                size="small"
                style={{ width: '100%', marginTop: 16, height: height / 3 - 50 - 16 }}
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
