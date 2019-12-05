
import React from 'react';

import { Select } from 'antd';
import { connect } from 'dva';

const joinSymbol = ' x '

const ListLayout = (props: any) => {

    const { listLayout, listLayoutOptions, dispatch } = props;
    const renderText = _ => _.join(joinSymbol);
    const menu = listLayoutOptions.map(_ => {
        return <Select.Option key={renderText(_)}>{renderText(_)}</Select.Option>;
    });
    return (
        <Select
            size="small"
            value={renderText(listLayout)}
            style={{ width: 70 }}
            onChange={value => {
                dispatch({
                    type: 'setting/setListLayout',
                    payload: { listLayout: value.split(joinSymbol).map(_ => +_) },
                });
            }}
        >
            {menu}
        </Select>
    );

}

export default connect(({ setting }: any) => ({
    listLayout: setting.listLayout,
    listLayoutOptions: setting.listLayoutOptions,
}))(ListLayout);
