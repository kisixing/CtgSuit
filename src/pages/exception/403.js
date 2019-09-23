import React from 'react';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception403 = () => (
  <Exception
    type="403"
    desc="用户得到授权，但是访问是被禁止。"
    linkElement={Link}
    backText="返回首页"
  />
);

export default Exception403;
