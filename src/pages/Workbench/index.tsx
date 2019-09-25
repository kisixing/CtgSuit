import React, { useState, useEffect, useRef } from 'react';
import L from '@lianmed/lmg';
import { Card, Icon, Row, Col, Button } from 'antd';
import { connect } from 'react-redux';
import './index.less';
const Home = props => {
  const { listLayout = [], pageItems, dispatch } = props;

  console.log(pageItems);
  const [loading, setLoading] = useState(true);
  const wrap = useRef(null);

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
  const outPadding = 4;
  const itemHeight = (height - outPadding * 2) / listLayout[1] - outPadding * 2 - 2 - 37 * 2;
  console.log(document.body.getClientRects()[0].height);
  return (
    <div style={{ height: '100%', overflow: 'hidden', background: '#fff' }} ref={wrap}>
      <Row style={{ padding: outPadding }}>
        {pageItems.map(({ id, name, age, index }) => {
          return (
            <Col span={itemSpan} key={id} style={{ padding: outPadding }}>
              <Card
                title={
                  <div>
                    【{index}】姓名：
                    <span style={{ color: '#000' }}>{name}</span>
                    <span style={{ margin: '0 10px' }} />
                    年龄：
                    <span style={{ color: '#000' }}>{age}</span>
                  </div>
                }
                size="small"
                headStyle={{ background: 'pink', color: '#888' }}
                style={{
                  border: '1px solid #aaa',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                extra={<Button icon="close" size="small" type="link"></Button>}
                loading={loading}
                bodyStyle={{
                  padding: 0,
                  flex: 1,
                  height: itemHeight,
                }}
                // actions={[
                //   <Icon type="setting" key="setting" />,
                //   <Icon type="edit" key="edit" />,
                //   <Icon type="ellipsis" key="ellipsis" />,
                //   <Icon type="setting" key="setting" />,
                //   <Icon type="edit" key="edit" />,
                //   <Icon type="ellipsis" key="ellipsis" />,
                // ]}
              >
                <L data={null}></L>
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
