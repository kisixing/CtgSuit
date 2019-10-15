/*
 * @Description: 账户管理
 * @Author: Zhong Jun
 * @Date: 2019-10-15 19:22:10
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Divider, Popconfirm, Button } from 'antd';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.columns = [
      {
        title: '账号名称',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: '密码',
        dataIndex: 'password',
        key: 'password',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          let statusText = '未知';
          if (text === '0') {
            statusText = '停用';
          }
          if (text === '1') {
            statusText = '激活';
          }
          return statusText;
        },
      },
      {
        title: '创建者',
        dataIndex: 'creator',
        key: 'creator',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createTime',
      },
      {
        title: '最近更新',
        dataIndex: 'updateDate',
        key: 'updateDate',
      },
      {
        title: '操作',
        dataIndex: 'actions',
        key: 'actions',
        render: (text, record) => {
          const { status, key } = record;
          let dom = null;
          if (status === '0') {
            dom = <a onClick={() => this.start(key)}>启用</a>;
          } else if (status === '1') {
            dom = <a onClick={() => this.stop(key)}>停用</a>;
          } else {
            dom = <span>启用</span>;
          }
          return (
            <>
              <span className="primary-link">修改</span>
              <Divider type="vertical" />
              {dom}
              <Divider type="vertical" />
              <Popconfirm title="确认删除该条信息？" okText="确定" cancelText="取消">
                <span className="delete-link">删除</span>
              </Popconfirm>
            </>
          );
        },
      },
    ];
  }

  start = key => {
    console.log('TCL: Account -> key -> start', key);
  };

  stop = key => {
    console.log('TCL: Account -> key -> stop', key);
  };

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      workId: '',
      name: '',
      department: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  render() {
    const { dataSource } = this.props;
    return (
      <>
        <Table size="small" pagination={false} columns={this.columns} dataSource={dataSource} />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newAccount}
          icon="plus"
        >
          新增账号
        </Button>
      </>
    );
  }
}

export default connect(({ setting, loading }) => ({
  dataSource: setting.accounts,
  loading: loading,
}))(Account);