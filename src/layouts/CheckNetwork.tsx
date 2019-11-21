import React, { useEffect, useState, useCallback } from 'react';
import { Button } from 'antd';
import { WsService } from "@lianmed/lmg";
import { EWsEvents } from '@lianmed/lmg/lib/services/types';

function CheckNetwork(props) {
    const [v, setV] = useState(false)
    const cb = useCallback((status: any) => {
        setV(!status)
    }, [])
    useEffect(() => {
        WsService._this.on(EWsEvents.pong, cb)
        return () => {
            WsService._this.off(EWsEvents.pong, cb)
        }
    }, [])
    useEffect(() => {
        window.addEventListener('online', function () {
            alert("onLine");
        });
        window.addEventListener('offline', function () {
            alert("offLine");
        });

        return () => {
        };
    }, [])

    return (
        v && <div style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            background: "red",
            zIndex: 2147483647,
            color: "#fff",
            textAlign: "center",
            fontSize: 18,
            // fontFamily: "Consolas, Menlo, Courier, monospace",
            padding: "8px 0px",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 8px",
        }}>
            <span>网络不可用，请检查你的网络设置</span>
            <Button icon="close" type="link" style={{ color: '#fff' }} onClickCapture={e => setV(false)} />
        </div>
    );
}

export default CheckNetwork;
