import React, { Component } from 'react';
import { Table, Divider, Button } from 'antd';
import { connect } from 'dva';
import EditModal from './EditModal';
import styles from './TableList.less';

class TableList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      current: {}, // 当前编辑孕册
    }
    this.columns = [
      {
        title: '住院号',
        dataIndex: 'inpatientNO',
        key: 'inpatientNO',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '检查次数',
        dataIndex: 'checkupNO',
        key: 'checkupNO',
      },
      {
        title: '孕次',
        dataIndex: 'gravidity',
        key: 'gravidity',
      },
      {
        title: '产次',
        dataIndex: 'parity',
        key: 'parity',
      },
      {
        title: '手机号码',
        dataIndex: 'telephone',
        key: 'telephone',
      },
      {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        width: 150,
        render: (text, record) => {
          return (
            <>
              <Button type="link" onClick={() =>this.showEdit(record)}>
                编辑
              </Button>
              <Button type="link">删除</Button>
            </>
          );
        },
      },
    ];
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'pregnancy/fetchPregnancies',
    });
  }

  hideEdit = () => {
    this.setState({ visible: false });
  }

  showEdit = (record) => {
    this.setState(
      {
        current: record,
      },
      () => {
        this.setState({ visible: true })
      },
    );
  }

  handleUpdate = () => {

  }


  render() {
    const { visible, current } = this.state;
    const { loading, pregnancies } = this.props;
    return (
      <div className={styles.tableList}>
        <Table
          bordered
          size="small"
          loading={loading.effects['pregnancy/fetchPregnancies']}
          dataSource={pregnancies}
          columns={this.columns}
        />
        <EditModal visible={visible} dataSource={current} onCancel={this.hideEdit} onOk={this.handleUpdate} />
      </div>
    );
  }
}

export default connect(({ loading, pregnancy }) => ({
  pregnancies: pregnancy.pregnancies,
  loading: loading,
}))(TableList);