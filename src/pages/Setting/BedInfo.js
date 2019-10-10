/*
 * @Description: 床位信息设置
 * @Author: Zhong Jun
 * @Date: 2019-10-10 20:37:05
 */

import React, { Component } from 'react'

class BedInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    this.columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        align: 'center',
      },
      {
        title: '检查次数',
        dataIndex: 'visitType',
        key: 'visitType',
        width: 80,
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        width: 100,
        render: (text, record) => record.pregnancy && record.pregnancy.name,
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 100,
        render: (text, record) => record.pregnancy && record.pregnancy.age,
      },
      {
        title: '孕周',
        dataIndex: 'gestationalWeek',
        key: 'gestationalWeek',
        width: 100,
      },
    ];
  }

  render() {
    return (
      <div>
        BedInfo
      </div>
    )
  }
}

export default BedInfo;