import React from 'react';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception500 = () => (
  <Exception
    type="500"
    desc="服务器发生错误，请检查服务器。"
    linkElement={Link}
    backText="返回首页"
  />
);

export default Exception500;
