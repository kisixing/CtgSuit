import request from '@/utils/request';
import '@ant-design/compatible/assets/index.css';
import { WsService } from '@lianmed/lmg/lib/services/WsService';
import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';

const socket = WsService._this;

interface IProps {
  pvId: string
  visible: boolean
  onCancel: () => void
  pregnancyId: number
}

export const SignModal = (props: IProps) => {
  const { visible, onCancel, pregnancyId, pvId } = props;
  const [jbLoading, setJbLoading] = useState(false)

  useEffect(() => {
    if (jbLoading && !pregnancyId) {
      setJbLoading(false)
      onCancel()
    }
  }, [pregnancyId, pvId, jbLoading])


  return (
    <Modal
      getContainer={false}
      centered
      destroyOnClose
      visible={visible}
      okText="确定"
      cancelText="取消"
      bodyStyle={{ paddingRight: '48px' }}
      onCancel={onCancel}
      okButtonProps={{ loading: jbLoading }}
      onOk={() => {
        setJbLoading(true)

        request.delete(`/prenatal-visits/${pvId}`)
      }}
    >
      提示:此操作将解除档案和孕妇的绑定，请谨慎操作！
    </Modal >
  );
}

export default SignModal;


