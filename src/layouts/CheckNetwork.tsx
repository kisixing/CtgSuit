import React, { useEffect, useState } from 'react';
import { useCheckNetwork } from "@lianmed/lmg";
import { connect } from 'dva';

function CheckNetwork(props) {
    const { dispatch, isOn } = props
    const [small, setSmall] = useState(true)


    useCheckNetwork(isOn => dispatch({ type: 'ws/setState', payload: { isOn } }))

    return (
        isOn || <div style={{
            display: 'flex', justifyContent: 'center',
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 2147483647,
            width: '100vw',

        }}>
            <div
                onClickCapture={e => location.reload()}

                style={{
                    cursor: 'pointer',
                    width: small ? '40vw' : '100vw',
                    background: "red",
                    color: "#fff",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: small ? 14 : 18,
                    // fontFamily: "Consolas, Menlo, Courier, monospace",
                    boxShadow: "rgba(0, 0, 0, 0.3) 0px 4px 8px",
                    transition: 'all .3s',
                    height: small ? 24 : 48,
                    lineHeight: '48px',
                    overflow: 'hidden',
                    borderRadius: small && 2
                }}>
                <span style={{ color: '#fff', }}>网络不可用，请检查你的网络设置（点击刷新）</span>
                {/* <Button size={small ? 'small' : 'default'} icon="reload" type="link" style={{ color: '#fff' }} onClickCapture={e => location.reload()} /> */}
                {/* <Button size={small ? 'small' : 'default'} icon={small ? 'column-height' : 'minus'} type="link" style={{ color: '#fff', marginLeft: 'auto' }} onClickCapture={e => setSmall(!small)} /> */}

            </div>
        </div >
    );
}

export default connect(({ ws }: any) => ({ isOn: ws.isOn }))(CheckNetwork);
