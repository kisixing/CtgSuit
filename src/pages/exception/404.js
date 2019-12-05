import React from 'react';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception404 = () => (
  <Exception
    type="404"
    desc="发出的请求针对的是不存在的记录，服务器没有进行操作。"
    linkElement={Link}
    backText="返回首页"
  />
);

export default Exception404;
