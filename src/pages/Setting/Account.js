/* eslint-disable jsx-a11y/anchor-is-valid */
/*
 * @Description: 账户管理
 * @Author: Zhong Jun
 * @Date: 2019-10-15 19:22:10
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import {
  Table,
  Divider,
  Popconfirm,
  Button,
  Badge,
  Input,
  Select,
  message,
  Tooltip,
} from 'antd';
import moment from 'moment';
import {
  getUsers,
  deleteUser,
  updateUser,
  createUser,
} from '../../services/api';
import request from '@/utils/request';

class Account extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      values: [],
      groups: [],
      wards: []
    };
    this.columns = [
      {
        title: '账号名称',
        dataIndex: 'firstName',
        key: 'firstName',
        width: 150,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e =>
                  this.handleFieldChange(e, 'firstName', record.id)
                }
                onKeyPress={e => this.handleKeyPress(e, record.id)}
                placeholder="账号名称"
              />
            );
          }
          return text;
        },
      },
      {
        title: '工号',
        dataIndex: 'login',
        key: 'login',
        width: 150,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'login', record.id)}
                onKeyPress={e => this.handleKeyPress(e, record.id)}
                placeholder="工号"
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
          const isNew = record.isNew;
          if (record.editable) {
            return (
              <Input.Password
                disabled={!isNew}
                value={text}
                onChange={e => this.handleFieldChange(e, 'password', record.id)}
                onKeyPress={e => this.handleKeyPress(e, record.id)}
                placeholder="账号密码"
              />
            );
          }
          return '******'; // text;
        },
      },
      // {
      //   title: '状态',
      //   dataIndex: 'activated',
      //   key: 'activated',
      //   width: 140,
      //   render: (text, record) => {
      //     if (record.editable) {
      //       return (
      //         <Select
      //           value={text}
      //           style={{ width: 120 }}
      //           onChange={e =>
      //             this.handleFieldChange(e, 'activated', record.id)
      //           }
      //           // onKeyPress={e => this.handleKeyPress(e, record.key)}
      //           placeholder="账户状态"
      //         >
      //           <Select.Option value={true}>激活</Select.Option>
      //           <Select.Option value={false}>停用</Select.Option>
      //         </Select>
      //       );
      //     }
      //     if (!text) {
      //       return <Badge status="error" text="停用" />;
      //     } else {
      //       return <Badge status="success" text="激活" />;
      //     }
      //   },
      // },
      {
        title: '用户组',
        dataIndex: 'groups',
        key: 'groups',
        width: 150,
        render: (text, record) => {
          if (record.editable) {
            const val = record['groups'].map(e => e && e.id);
            const { groups } = this.state;
            return (
              <Select
                mode="multiple"
                value={val}
                style={{ width: 136 }}
                // onFocus={this.fetchGroups}
                onChange={e => {
                  const { groups } = this.state;
                  let selecteds = [];
                  groups.map(a => {
                    if (e.includes(a.id)) {
                      selecteds.push(a);
                    }
                  });
                  return this.handleFieldChange(selecteds, 'groups', record.id);
                }}
                placeholder="请选择用户组"
              >
                {groups &&
                  groups.length > 0 &&
                  groups.map(e => {
                    return (
                      <Select.Option value={e.id}>{e.nickname}</Select.Option>
                    );
                  })}
              </Select>
            );
          }
          const str = record['groups'].map(e => e && e.nickname);
          return str.join(',');
        },
      },
      {
        title: '病区',
        dataIndex: 'wards',
        key: 'wards',
        width: 200,
        render: (text, record) => {
          if (record.editable) {
            const { wards } = this.state;
            const val = record['wards'].map(e => e && e.id);
            return (
              <Select
                mode="multiple"
                value={val}
                style={{ width: 136 }}
                // onFocus={this.fetchWards}
                onChange={e => {
                  const { wards } = this.state;
                  let selecteds = [];
                  wards.map(a => {
                    if (e.includes(a.id)) {
                      selecteds.push(a);
                    }
                  });
                  return this.handleFieldChange(selecteds, 'wards', record.id);
                }}
                placeholder="请选择病区"
              >
                {wards &&
                  wards.length > 0 &&
                  wards.map(e => {
                    return (
                      <Select.Option value={e.id}>{e.wardName}</Select.Option>
                    );
                  })}
              </Select>
            );
          }
          const str = record['wards'].map(e => e && e.wardName).join(',');
          // const tt = str.join(',');
          return (
            <Tooltip title={str}>
              <div
                style={{
                  display: 'inline-block',
                  width: '200px',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  wordBreak: 'break-all',
                }}
              >
                {str}
              </div>
            </Tooltip>
          );
        },
      },
      {
        title: '创建者',
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: 'createdDate',
        key: 'createdDate',
        width: 150,
        render: text =>
          text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : 'xxx-xx-xx xx:xx',
      },
      // {
      //   title: '最近更新',
      //   dataIndex: 'lastModifiedDate',
      //   key: 'lastModifiedDate',
      //   width: 150,
      //   render: text =>
      //     text
      //       ? moment(text).format('YYYY-MM-DD HH:mm:ss')
      //       : 'XXXX-XX-XX XX:XX',
      // },
      {
        title: '操作',
        dataIndex: 'actions',
        key: 'actions',
        width: 160,
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.id)}>保存</a>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="是否要删除此行？"
                    onConfirm={() => this.remove(record.id)}
                  >
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.id)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.id)}>取消</a>
              </span>
            );
          } else {
            const { activated, id } = record;
            let dom = null;
            if (!activated) {
              dom = (
                <>
                  <Divider type="vertical" />
                  <a onClick={() => this.start(id)}>启用</a>
                </>
              );
            }
            return (
              <>
                <span
                  className="primary-link"
                  onClick={e => {
                    // 获取select options
                    this.fetchGroups();
                    this.fetchWards();
                    this.toggleEditable(e, record.id);
                  }}
                >
                  编辑
                </span>
                {dom}
                <Divider type="vertical" />
                <Popconfirm
                  title="确认删除该条信息？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => this.deleted(record.id, record.login)}
                >
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
    this.fetchUsers();
  }

  // 获取全部账户信息
  fetchUsers = () => {
    this.setState({ loading: true });
    getUsers()
      .then(res => {
        this.setState({ loading: false });
        this.setState({
          data: res,
          values: res,
        });
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  };

  start = key => {
    console.log('TCL: Account -> key -> start', key);
  };

  stop = key => {
    console.log('TCL: Account -> key -> stop', key);
  };

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.id === key)[0];
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
      id: `NEW_TEMP_ID_${this.index}`,
      login: '',
      firstName: '',
      password: '',
      activated: true,
      createdBy: account.login,
      createdDate: date,
      lastModifiedBy: date,
      editable: true,
      isNew: true,
      groups: [],
      wards: [],
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  // 删除本地新增的
  remove = key => {
    const { data } = this.state;
    const newData = data.filter(item => item.id !== key);
    this.setState({ data: newData });
  };

  // 实际删除后台的
  deleted = (key, name) => {
    deleteUser(name)
      .then(res => {
        // 更新本地信息
        message.success(`删除用户${name}成功！`);
        this.remove(key);
      })
      .catch(err => {
        message.error(`删除用户${name}失败，请稍后再试！`);
      });
  };

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    console.log(
      'TCL: Account -> handleFieldChange -> newData',
      e,
      fieldName,
      key,
      newData,
    );
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
    if (this.clickedCancel) {
      this.clickedCancel = false;
      return;
    }
    const target = this.getRowByKey(key) || {};

    // 判断新建还是更像
    // const ID = target.id.toString();
    // const isNew = ID.includes('NEW_TEMP_ID');

    if (
      !target.firstName ||
      !target.login ||
      !target.groups.length ||
      !target.wards.length
    ) {
      message.error('请填写完整成员信息。');
      e.target.focus();
      this.setState({
        loading: false,
      });
      return;
    }
    if (target.isNew) {
      target.id = '';
      if (!target.password) {
        this.setState({
          loading: false,
        });
        return message.error('请设置账户密码！');
      }
      delete target.isNew;
      this.create(target);
    } else {
      this.update(target);
    }
    this.toggleEditable(e, key);
    this.setState({
      loading: false,
    });
  }

  // 修改账户信息
  update = params => {
    updateUser(params)
      .then(res => {
        message.success(`修改用户${params.login}成功！`);
      })
      .catch(err => {
        message.error(`修改用户${params.login}失败，请稍后再试！`);
      });
  };

  // 新增账户
  create = params => {
    createUser(params)
      .then(res => {
        message.success(`新增用户${params.login}成功！`);
        this.fetchUsers();
      })
      .catch(err => {
        message.error(`新增用户${params.login}失败，请稍后再试！`);
      });
  };

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

  fetchWards = () => {
    request.get('/wards').then(res => {
      this.setState({ wards: res });
    });
  };

  fetchGroups = () => {
    request.get('/groups').then(res => {
      this.setState({ groups: res });
    });
  };

  render() {
    const { data, loading } = this.state;
    return <>
      <div style={{ fontWeight: 600, marginBottom: '12px' }}>账户管理</div>
      <Table
        loading={loading}
        size="small"
        scroll={{ x: 1280 }}
        pagination={false}
        columns={this.columns}
        dataSource={data}
        rowKey="id"
      />
      <Button
        style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
        type="dashed"
        onClick={() => {
          // 获取select options
          this.fetchGroups();
          this.fetchWards();
          this.newAccount();
        }}
        icon={<LegacyIcon type="plus" />}
      >
        新增账号
      </Button>
    </>;
  }
}

const A = connect(({ global, setting }) => ({
  account: global.account,
}))(Account);

A.displayName = '账号管理'

export default A