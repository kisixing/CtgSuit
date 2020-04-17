import React, { useState, useEffect } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Button, Row, Col, Popover } from "antd";
import { qrcode } from '@lianmed/utils'
import { connect, DispatchProp } from 'dva';
import Table from "./Table";
import useStupidConcat from './useStupidConcat'
const styles = require('../style.less');
import { IWard } from "@/types";
interface IProps extends DispatchProp {
  subscribeData?: string[]
  ward: IWard
  [x: string]: any;
}

const C = (props: IProps) => {
  const { subscribeData, dispatch, ward } = props
  const [editable, setEditable] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  useEffect(() => {
    setSelected(subscribeData)
  }, [subscribeData])

  const cancel = () => {
    setEditable(false)
    setSelected(subscribeData)
  }

  const comfirm = () => {
    setEditable(false)
    dispatch({ type: 'subscribe/setData', note: selected.join(',') })
  }
  const remove = (key: string) => {
    const data = [...selected]
    data.splice(data.indexOf(key), 1)
    setSelected(data)
  }
  const { list } = useStupidConcat()

  return (
    <div className={styles.form}>
      <div className={styles.subTitle}>已订阅列表</div>

      <Row gutter={6}>
        <Col span={20}>
          <div
            style={{
              position: 'relative',
              background: 'var(--theme-shadow-color)',
              borderRadius: 4,
              cursor: editable ? 'auto' : 'not-allowed',
            }}
          >
            <div style={{ height: 140, overflow: 'scroll', padding: 4 }}>
              {selected.map(id => {
                const _ = list.find(_ => _.deviceno === id);
                if (!_) return null;
                const deviceno = _.deviceno;
                return (
                  <Button
                    onClick={e => {
                      remove(deviceno);
                    }}
                    disabled={!editable}
                    size="small"
                    style={{ margin: '0 4px 4px 0' }}
                    key={deviceno}
                  >
                    {`${_.areano === ward.wardId ? '' : `${_.areaname}：`}${
                      _.bedname
                      }`}
                    {editable && <LegacyIcon type="close"></LegacyIcon>}
                  </Button>
                );
              })}
            </div>
            {editable && (
              <LegacyIcon
                type="close"
                onClick={() => setSelected([])}
                style={{
                  position: 'absolute',
                  right: 10,
                  bottom: 10,
                  background: '#999',
                  color: '#fff',
                  padding: 6,
                  borderRadius: '100%',
                }}
              ></LegacyIcon>
            )}
          </div>

          {editable && (
            <Table
              onAdd={data => setSelected([...new Set(selected.concat(data))])}
            />
          )}
        </Col>
        {/* <Col span={4}>
                    <Button style={{ marginBottom: 6, width: 74 }} type="primary" onClick={() => editable ? comfirm() : setEditable(!editable)}>{editable ? '确认' : '编辑'}</Button><br />
                    {
                        editable ? (
                            <Button style={{ marginBottom: 6, width: 74 }} type="danger" onClick={cancel}>取消</Button>
                        ) : (
                                <QR placement="right" trigger="hover">
                                    <Button>二维码</Button>
                                </QR>
                            )
                    }

                </Col> */}
      </Row>
    </div>
  );
};


const S = connect((state: any) => ({ subscribeData: state.subscribe.data, ward: state.subscribe.ward }))(C)
export const QR = connect(({ subscribe, setting }: any) => ({ subscribeData: subscribe.data, ward: subscribe.ward, }))(
  (props: { subscribeData: string[], [x: string]: any }) => {
    const { subscribeData, ward, children, ...others } = props
    const { wardId, wardType } = ward as IWard
    const [src, setSrc] = useState('')
    useEffect(() => {
      qrcode.toDataURL(` subscribe_${wardType || null}_${wardId || null}_${subscribeData.join(',') || null}`).then(_ => setSrc(_))
    }, [subscribeData, wardId, wardType])
    return (
      <Popover
        {...others}
        content={<img alt="Popover" style={{ width: 100, height: 100 }} src={src} />}
      >
        {children}
      </Popover>
    );
  }
)
S.displayName = '订阅设置'
export default S