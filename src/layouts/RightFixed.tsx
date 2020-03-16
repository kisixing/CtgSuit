import React, { memo, useRef, useState, useCallback, useEffect } from 'react';
import { Popconfirm, Button, Modal, Form, Input, Tooltip } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import styled from "styled-components";
import request from '@lianmed/request';
// import { Icon as LegacyIcon } from '@ant-design/compatible';
// import { ipcRenderer } from 'electron';

// import settingStore from "@/utils/SettingStore";


// const settingData = settingStore.cache
// const colors = AntdThemeManipulator.colors
// declare var __VERSION: string;
const Wrapper = styled.div`
img {
    width:48px;
    height:48px;
    padding:8px;
    border-radius:48px;
    background:rgb(236,236,236);
}
.b {
    width:112px;
    padding:16px 0;
    position:relative;
    display:block;
    height:auto;
    border:0;
    box-shadow:unset;
    cursor:pointer;
    transition:all .5s;
}
.b:hover {
    background:rgb(20,20,20);
}
.b:hover .more {
    display:block;
}
.title {
    width: 88px;
    text-align: center;
    margin-top: 6px;
    text-overflow:ellipsis;
    white-space:nowrap;
    overflow:hidden;
}
.more {
    position:absolute !important;
    padding:6px;
    right:0;
    top:0;
    border:unset;
    display:none;
}
`
const data = [
    {
        url: 'http://www.baidu.com',
        name: 'baidu'
    },
    // {
    //     url: 'http://localhost:3000/remote/index.html',
    //     name: 'remote'
    // },
    {
        url: 'http://ccs.lian-med.com/zentaopms/www/user-login-L3plbnRhb3Btcy93d3cv.html',
        name: 'ccs'
    },

]

const Foot = (props: any) => {
    const [visible, setVisible] = useState(false)
    const toggleVisible = useCallback(() => setVisible(!visible), [visible])

    const [metaData, setMetaData] = useState<{ title?: string, iconUrl?: string, url?: string, name?: string }[]>([])


    useEffect(() => {
        const d = []
        Promise.all(
            data.map(_ => {
                return request.get('', { prefix: _.url }).then(raw => {
                    if (raw) {
                        let iconUrl = ''
                        const origin = new URL(_.url).origin
                        const el = document.createElement('html')
                        el.innerHTML = raw
                        const l: HTMLLinkElement = el.querySelector('link[rel=icon]')
                        if (l) {
                            let href = l.getAttribute('href')
                            if (href.includes('//')) {
                                iconUrl = href
                            } else {
                                iconUrl = `${origin}${l.getAttribute('href')}`
                            }
                        }
                        const t: HTMLTitleElement = el.querySelector('title')
                        const title = t && t.innerText
                        return ({
                            ..._, title, iconUrl
                        })
                    } else {
                        return _
                    }
                })
            })
        ).then(d => {
            setMetaData(d)
        })


    }, [])






    const B = ({ iconUrl = '', title = '' }) => {
        return (
            <div className="b" onClick={() => alert('')}>
                <div style={{ display: 'flex', alignItems: 'center', flexFlow: 'column nowrap' }}>
                    <img src={iconUrl} />
                    <div className="title">
                        {title}
                    </div>
                </div>
                <MoreOutlined className="more" onClick={e => {
                    e.stopPropagation();
                    toggleVisible()
                }}></MoreOutlined>
            </div>
        )
    }


    const Title = () => {
        return (
            <Wrapper style={{ display: 'flex', width: 340, flexWrap: 'wrap' }}>
                {
                    metaData.map(_ => (
                        <B title={_.title} iconUrl={_.iconUrl} key={_.name} />
                    ))
                }
            </Wrapper>
        )
    }
    return (
        <>
            <Tooltip placement="rightBottom" title={<Title />} >
                <div style={{
                    position: 'fixed',
                    right: 0,
                    bottom: 60,
                    width: 10,
                    height: 40,
                    background: 'var(--theme-color)',
                    lineHeight: '40px',
                    color: '#fff',
                    textAlign: 'center',
                    cursor: 'pointer'
                }}>||</div>
            </Tooltip>
            <Modal centered width={300} visible={visible} onCancel={toggleVisible} onOk={toggleVisible}>
                <Form>
                    <Form.Item name="title" label="标题">
                        <Input />
                    </Form.Item>
                    <Form.Item name="url" label="地址">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default memo(Foot)
