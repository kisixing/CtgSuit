import React, { useEffect, useState } from 'react';
import { Button } from 'antd';

function CheckNetwork({ visible }) {
    const [v, setV] = useState(false)
    useEffect(() => {
        setV(visible)
    }, [visible])
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
