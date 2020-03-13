import React, { useRef, useEffect, useState } from 'react';
import { Row, Empty } from 'antd';
import Item from './Item';


interface IProps {
  RenderIn: any
  items: any[]
  listLayout: any[],
  fullScreenId: string,
  onClose: (data: any) => void
  contentHeight: number
}
const Home = (props: IProps) => {
  const { listLayout = [], fullScreenId, contentHeight, RenderIn, items, onClose } = props;
  const wrap = useRef(null);
  const empty = useRef(null)

  const itemSpan = 24 / listLayout[1];
  const outPadding = 6;


  const itemHeight = (contentHeight - outPadding * 2) / listLayout[0];


  return (
    <div style={{ height: '100%' }} ref={wrap}>
      {
        <Row justify="start" align="top" style={{ padding: outPadding, maxHeight: contentHeight, overflow: 'hidden' }} >
          {items.length ? items.map((item: any) => {
            const { data, bedname, unitId, isTodo } = item;
            const safePregnancy = data.pregnancy || { pvId: null, age: null, name: null, inpatientNO: null, bedNO: null, id: null, GP: null, gestationalWeek: null }
            const docid = data.docid
            const startTime = data.starttime
            const status = data.status
            return (
              <Item
                onClose={onClose}
                data={data as any}
                ismulti={data.ismulti}
                docid={docid}
                status={status}
                loading={false}
                pregnancy={safePregnancy}
                // startTime={safePrenatalVisit.ctgexam.startTime}
                startTime={startTime}

                bedname={bedname}
                unitId={unitId}
                isTodo={isTodo}
                key={item.id}
                itemHeight={itemHeight}
                itemSpan={itemSpan}
                outPadding={outPadding}
                fullScreenId={fullScreenId}

                itemData={item}
              >

                <RenderIn itemData={item} />

              </Item>
            );
          }) : (
              <div ref={empty} style={{ marginTop: 200, display: 'flex', justifyContent: 'center', width: '100%' }}>
                <Empty description="胎监工作站" />
              </div>
            )
          }
        </Row>
      }
    </div>
  );
};

export default Home;
