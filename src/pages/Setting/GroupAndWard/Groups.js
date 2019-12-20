/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { Table, Card, Button, Divider, Tooltip, Popconfirm, message } from 'antd';
import { request } from '@lianmed/utils';
import GroupModal from './GroupModal';

import styles from './index.less';

export default class Groups extends Component {
  constructor(params) {
    super(params);
    this.state = {
      dataSource: [],
      selected: {},
      loading: false,
      visible: false
    }
    this.columns = [
      {
        title: '名称',
        dataIndex: 'nickname',
        key: 'nickname',
        width: 100,
      },
      {
        title: '类型',
        dataIndex: 'name',
        key: 'name',
        width: 100,
      },
      {
        title: '权限列表',
        dataIndex: 'authorities',
        key: 'authorities',
        width: 200,
        render: (text, record) => {
          let str = '';
          const { authorities } = record;
          if (authorities && authorities.length > 0) {
            authorities.forEach(e => {
              if (str) {
                str += `,${e.name}`;
              }
              str += e.name;
            });
          }
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
        title: '说明',
        dataIndex: 'groupdesc',
        key: 'groupdesc',
        width: 120,
        render: text => (
          <Tooltip title={text}>
            <div
              style={{
                display: 'inline-block',
                width: '120px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                wordBreak: 'break-all',
              }}
            >
              {text}
            </div>
          </Tooltip>
        ),
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        render: (text, record) => (
          <span>
            <a onClick={() => this.showEditGroup(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => this.deleteGroup(record)}
            >
              <a style={{ color: '#999' }}>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
  }

  componentDidMount() {
    this.fetchGroups()
  }

  showEditGroup = (record) => {
    this.setState({
      visible: true,
      selected: record
    }, () => {
      const { name, nickname, authorities, groupdesc } = record;
      let auth = [];
      if (authorities && authorities.length) {
        authorities.forEach(e => {
          auth.push(e.name)
        });
      }
      this.formRef.props.form.setFieldsValue({
        name: name,
        nickname: nickname,
        authorities: auth,
        groupdesc: groupdesc,
      });
    });
  }

  showNewGroup = () => {
    this.setState({ visible: true, selected: {} });
  }

  onCancel = () => {
    this.setState({ visible: false, loading: false })
  }

  deleteGroup = (record) => {
    request
      .delete(`/groups/${record.id}`)
      .then(res => {
        message.success(`用户组${record.nickname}删除成功！`);
        this.fetchGroups();
      })
      .catch(err => {
        message.error(`用户组${record.nickname}删除失败，请稍后再试！`);
      });
  }

  fetchGroups = () => {
    request.get('/groups').then(res => {
      this.setState({ dataSource: res });
    });
  };

  newGroup = () => {
    this.setState({ loading: true });
    this.formRef.props.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      const authorities = values.authorities;
      let newAuthorities = null;
      if (authorities && authorities.length) {
        newAuthorities = this.transData(values.authorities);
      }
      values.authorities = newAuthorities;
      request
        .post('/groups', {
          data: values,
        })
        .then(res => {
          this.setState({ loading: false, visible: false });
          message.success(`新增用户组${res.nickname}成功！`);

          this.fetchGroups();
        })
        .catch(error => {
          message.error(`新增用户组失败，请稍后再试。`);
          this.setState({ loading: false });
        });
    });
  }

  editGroup = () => {
    this.setState({ loading: true });
    const { selected } = this.state;
    this.formRef.props.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      const newValues = { ...selected, ...values };

      const authorities = values.authorities;
      let newAuthorities = null;
      if (authorities && authorities.length) {
        newAuthorities = this.transData(values.authorities);
      }
      newValues.authorities = newAuthorities;
      request
        .put('/groups', {
          data: newValues,
        })
        .then(res => {
          this.setState({ loading: false, visible: false });
          message.success(`修改用户组${res.nickname}成功！`);

          this.fetchGroups();
        })
        .catch(error => {
          message.error(`修改用户组失败，请稍后再试。`);
          this.setState({ loading: false });
        });
    });
  }

  transData = (data) => {
    return data.map(e => ({ name: e}));
  }

  render() {
    const { dataSource, visible, selected, loading } = this.state;
    return (
      <Card
        title="用户组设置"
        size="small"
        extra={
          <Button
            type="primary"
            icon="plus"
            size="small"
            loading={false}
            onClick={this.showNewGroup}
          >
            新增
          </Button>
        }
        style={{ width: '100%', height: '100%' }}
      >
        <Table
          dataSource={dataSource}
          columns={this.columns}
          pagination={false}
          size="small"
        />
        <GroupModal
          wrappedComponentRef={form => (this.formRef = form)}
          visible={visible}
          title={selected.id ? '编辑用户组' : '新增用户组'}
          loading={loading}
          onOk={selected.id ? this.editGroup : this.newGroup}
          onCancel={this.onCancel}
        />
      </Card>
    );
  }
}
