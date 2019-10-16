/* eslint-disable jsx-a11y/anchor-is-valid */
/*
 * @Description: 账户管理
 * @Author: Zhong Jun
 * @Date: 2019-10-15 19:22:10
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Divider, Popconfirm, Button, Badge, Input, Select, message } from 'antd';
import isEqual from 'lodash/isEqual';
import moment from 'moment';

class Account extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      values: [],
    };
    this.columns = [
      {
        title: '账号名称',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'name', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="账号名称"
              />
            );
          }
          return text;
        },
      },
      {
        title: '密码',
        dataIndex: 'password',
        key: 'password',
        width: 150,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input.Password
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'password', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="账号密码"
              />
            );
          }
          return text;
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 140,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                value={text}
                style={{ width: 120 }}
                onChange={e => this.handleFieldChange(e, 'status', record.key)}
                // onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="账户状态"
              >
                <Select.Option value="0">停用</Select.Option>
                <Select.Option value="1">激活</Select.Option>
                <Select.Option value="2">注销</Select.Option>
              </Select>
            );
          }
          if (text === '0') {
            return <Badge status="error" text="停用" />;
          } else if (text === '1') {
            return <Badge status="success" text="激活" />;
          } else {
            return <Badge status="default" text="注销" />;
          }
        },
      },
      {
        title: '创建者',
        dataIndex: 'creator',
        key: 'creator',
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createTime',
        width: 150,
        render: text => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '最近更新',
        dataIndex: 'updateDate',
        key: 'updateDate',
        width: 150,
        render: text => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '操作',
        dataIndex: 'actions',
        key: 'actions',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          } else {
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
                <span className="primary-link" onClick={e => this.toggleEditable(e, record.key)}>
                  编辑
                </span>
                <Divider type="vertical" />
                {dom}
                <Divider type="vertical" />
                <Popconfirm title="确认删除该条信息？" okText="确定" cancelText="取消">
                  <span className="delete-link">删除</span>
                </Popconfirm>
              </>
            );
          }
        },
      },
    ];
  }

  componentDidMount() {
    const { dataSource } = this.props;
    this.setState({
      data: dataSource,
      values: dataSource,
    });
  }

  start = key => {
    console.log('TCL: Account -> key -> start', key);
  };

  stop = key => {
    console.log('TCL: Account -> key -> stop', key);
  };

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newAccount = () => {
    const { data } = this.state;
    const { account } = this.props;
    const newData = data.map(item => ({ ...item }));
    const date = moment();
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      name: '',
      password: '',
      status: '1',
      creator: account.login,
      createDate: date,
      updateDate: date,
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    console.log('TCL: Account -> handleFieldChange -> newData', newData);
    const target = this.getRowByKey(key, newData);
    if (target) {
      const value = e.target ? e.target.value : e;
      target[fieldName] = value;
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.password || !target.name || !target.status) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      // const { data } = this.state;
      // const { onChange } = this.props;
      // onChange(data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  render() {
    const { data, loading } = this.state;
    return (
      <>
        <Table
          loading={loading}
          size="small"
          pagination={false}
          columns={this.columns}
          dataSource={data}
        />
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

export default connect(({ global, setting, loading }) => ({
  account: global.account,
  dataSource: setting.accounts,
  loading: loading,
}))(Account);