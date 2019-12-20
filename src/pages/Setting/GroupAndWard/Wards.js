/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import {
  Table,
  Card,
  Button,
  Divider,
  Tooltip,
  Popconfirm,
  message
} from 'antd';
import { request } from '@lianmed/utils';
import WardModal from './WardModal';

import styles from './index.less';

class Wards extends Component {
  constructor(params) {
    super(params);
    this.state = {
      dataSource: [],
      visible: false,
      selected: {},
      loading: false,
    };
    this.columns = [
      {
        title: '病区编号',
        dataIndex: 'wardId',
        key: 'wardId',
        width: 100,
      },
      {
        title: '病区名称',
        dataIndex: 'wardName',
        key: 'wardName',
        width: 100,
      },
      {
        title: '病区类型',
        dataIndex: 'wardType',
        key: 'wardType',
        width: 100,
        render: text => {
          let t = '住院';
          if (text === 'out') {
            t = '门诊';
          }
          return t;
        }
      },
      {
        title: '设备组',
        dataIndex: 'note',
        key: 'note',
        width: 200,
        render: text => (
          <Tooltip title={text}>
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
            <a onClick={() => this.showEditWard(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="是否要删除此行？"
              onConfirm={() => this.deleteWard(record)}
            >
              <a style={{ color: '#999' }}>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
  }

  componentDidMount() {
    this.fetchWards()
  }

  showEditWard = (record) => {
    this.setState({
      visible: true,
      selected: record
    }, () => {
      const { wardId, wardName, wardNamezh, wardType, note } = record;

      this.formRef.props.form.setFieldsValue({
        wardId: wardId,
        wardName: wardName,
        wardNamezh: wardNamezh,
        wardType: wardType,
        note: note ? note.split(',') : [],
      });
    });

  }

  showNewWard = () => {
    this.setState({ visible: true, selected: {} });
  }

  onCancel = () => {
    this.setState({ visible: false, loading: false });
  }

  deleteWard = (record) => {
    request
      .delete(`/wards/${record.id}`)
      .then(res => {
        message.success(`病区${record.wardName}删除成功！`);
        this.fetchWards();
      })
      .catch(err => {
        message.error(`病区${record.wardName}删除失败，请稍后再试！`);
      });
  }

  fetchWards = () => {
    request.get('/wards').then(res => {
      this.setState({ dataSource: res });
    });
  };

  newWard = () => {
    this.setState({ loading: true });
    this.formRef.props.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      request
        .post('/wards', {
          data: values,
        })
        .then(res => {
          this.setState({ loading: false, visible: false });
          message.success(`新增病区${res.wardName}成功！`);

          this.fetchWards();
        })
        .catch(error => {
          message.error(`新增病区失败，请稍后再试。`);
          this.setState({ loading: false });
        });
    });
  }

  editWard = () => {
    this.setState({ loading: true });
    const { selected } = this.state;
    this.formRef.props.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      const newValues = { ...selected, ...values };
      request
        .put('/wards', {
          data: newValues,
        })
        .then(res => {
          this.setState({ loading: false, visible: false });
          message.success('修改病区成功！');

          this.fetchWards()
        })
        .catch(error => {
          message.error(`修改病区失败，请稍后再试。`);
          this.setState({ loading: false });
        });
    });
  }

  render() {
    const { dataSource, visible, selected, loading } = this.state;
    return (
      <Card
        title="病区管理"
        size="small"
        extra={
          <Button
            type="primary"
            icon="plus"
            size="small"
            loading={false}
            onClick={this.showNewWard}
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
          loading={loading}
        />
        <WardModal
          wrappedComponentRef={form => this.formRef = form}
          visible={visible}
          title={selected.id ? '编辑病区' : '新增病区'}
          loading={loading}
          onOk={selected.id ? this.editWard : this.newWard}
          onCancel={this.onCancel}
        />
      </Card>
    );
  }
}

export default Wards;
