import { IPregnancy } from "@lianmed/f_types";
import { usePage } from "@lianmed/utils";
import { Form, Layout, message, Modal } from 'antd';
import React, { useState } from 'react';
import store from 'store';
import SearchForm from './SearchForm';
import TableList from './TableList';

const styles = require('./index.less')

export default function Pregnancy(props) {
  const ward = store.get('ward');
  const [form] = Form.useForm()
  const [wardId, setWardId] = useState(ward && ward.wardId)

  const isOut = (ward && ward.wardType) === 'out'
  // const noKey = isIn ? 'inpatientNO' : 'cardNO';
  // const noLabel = isIn ? '住院号' : '卡号'

  const getFields = () => {
    const data = form.getFieldsValue();
    return Promise.resolve(data)
  }
  const d = {
    recordstate: isOut ? undefined : '10',
    // 默认进来只显示本病区,条件查询就不限制本病区
    areaNO: wardId,
    sort: 'id,asc',

  }
  const {
    pagination,
    loading,
    listData,
    fetchList,
    updateItem,
    createItem,
    getItems,
  } = usePage<IPregnancy>(
    'pregnancies',
    { pageSize: 10, current: 1, ...d },
    getFields,
    {
      cardNO: 'inpatientNO.contains',
      inpatientNO: 'inpatientNO.contains',
      name: 'name.contains',
      recordstate: 'recordstate.equals',
      edd: 'edd.equals',
      areaNO: 'areaNO.equals',
    })
  function handCreate(data: IPregnancy) {
    isOut || getItems({ 'bedNO.equals': data.bedNO, size: 999, page: 0 }).then(existList => {
      if (existList.length) {
        Modal.confirm({
          centered: true,
          okText: '确定',
          cancelText: '放弃',
          title: '提示',
          content: `已存在相同床号的孕妇：${existList.map(_ => _.name).join('、')}等${existList.length}人，是否编辑为出院？`,
          onOk() {
            Promise
              .all(existList.map(_ => {
                return updateItem({ ..._, recordstate: "20" })
              }))
          },
          onCancel() {

          }
        })
      }
    })
    createItem(data).then(() => {
      message.success('孕册创建成功！');
    })
  }
  return (
    <Layout className={styles.wrapper}>
      <div>
        <SearchForm
          isOut={isOut}
          handCreate={handCreate}
          handleSubmit={() => {
            fetchList({ areaNO: undefined })
            setWardId(undefined)
          }}
          form={form}
        />
      </div>
      <Layout>
        <TableList isOut={isOut} getFields={getFields} loading={loading} pregnancies={listData} pagination={pagination} fetchData={fetchList} updateItem={updateItem} />
      </Layout>
    </Layout>
  );
}
