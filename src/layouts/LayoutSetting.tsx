
import React from 'react';

import { Menu, Dropdown, Button } from 'antd';
import { connect } from 'dva';

const joinSymbol = ' x '

const ListLayout = (props: any) => {
    const { listLayout, listLayoutOptions, dispatch, layoutLock } = props;
    const renderText = _ => _.join(joinSymbol);

    const menu = (
        <Menu style={{ textIndent: 6 }} onClick={({ key }) => {
            dispatch({
                type: 'setting/setListLayout',
                payload: { listLayout: key.split(joinSymbol).map(_ => +_), layoutLock: false },
            });
        }}>
            {
                listLayoutOptions.map(_ => <Menu.Item key={renderText(_)}>{`${_[0]} 行 x ${_[1]} 列 `}</Menu.Item>)
            }
        </Menu>
    );
    return (
        <Dropdown overlay={menu}>
            <Button type="primary">
                <span> 窗口：</span>
                {
                    renderText(listLayout)
                }
            </Button>
        </Dropdown>
    );
}

export default connect(({ setting }: any) => ({
    listLayout: setting.listLayout,
    layoutLock: setting.layoutLock,
    listLayoutOptions: setting.listLayoutOptions,
}))(ListLayout);
