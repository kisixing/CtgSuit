import React, { useEffect, useState } from 'react';
import { useCheckNetwork } from "@lianmed/lmg";
import { connect } from 'dva';
import { InfoCircleOutlined } from '@ant-design/icons';
import settingStore from "@/utils/SettingStore";

function CheckNetwork(props) {
    const { dispatch, isOn } = props
    const [small, setSmall] = useState(true)


    useCheckNetwork(isOn => dispatch({ type: 'ws/setState', payload: { isOn } }))

    return (
        (isOn || !!settingStore.cache.isRemote) || (
            <div style={{
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
                        background: "yellow",
                        color: "var(--theme-bg)",
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
                    <InfoCircleOutlined />
                    <span style={{ color: 'var(--theme-bg)', margin: '0 6px' }}>网络不可用，请检查你的网络设置</span>
                    {/* <Button size={small ? 'small' : 'default'} icon="reload" type="link" style={{ color: 'var(--theme-bg)' }} onClickCapture={e => location.reload()} /> */}
                    {/* <Button size={small ? 'small' : 'default'} icon={small ? 'column-height' : 'minus'} type="link" style={{ color: 'var(--theme-bg)', marginLeft: 'auto' }} onClickCapture={e => setSmall(!small)} /> */}

                </div>
            </div >
        )
    );
}

export default connect(({ ws }: any) => ({ isOn: ws.isOn }))(CheckNetwork);
