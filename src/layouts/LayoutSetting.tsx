
import React from 'react';

import { Select, Menu, Dropdown, Button } from 'antd';
import { connect } from 'dva';

const joinSymbol = ' x '




const ListLayout = (props: any) => {



    const { listLayout, listLayoutOptions, dispatch } = props;
    const renderText = _ => _.join(joinSymbol);


    const menu = (
        <Menu style={{ textIndent:10 }} onClick={({ key }) => {
            dispatch({
                type: 'setting/setListLayout',
                payload: { listLayout: key.split(joinSymbol).map(_ => +_) },
            });
        }}>
            {
                listLayoutOptions.map(_ => {
                    return <Menu.Item key={renderText(_)}>{`${_[0]} 行 ${_[1]} 列 `}</Menu.Item>
                })
            }
        </Menu>
    );


    return (
        <Dropdown overlay={menu}>
            <Button type="primary">
                <span> 窗口排列：</span>
                {
                    renderText(listLayout)
                }
            </Button>
        </Dropdown>



    );

}

export default connect(({ setting }: any) => ({
    listLayout: setting.listLayout,
    listLayoutOptions: setting.listLayoutOptions,
}))(ListLayout);
