import React, { useState, useEffect, useRef, FunctionComponent } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Button, message } from 'antd';


const styles = require('./Toolbar.less');

const Bar: FunctionComponent = function (porps) {
  const [showSetting, setShowSetting] = useState(false)



  const timeout = useRef(null)






  const autoHide = () => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      setShowSetting(false)
    }, 15000);
  };
  const toggleTool = () => {
    setShowSetting(!showSetting);
    autoHide();
  };





  const fp = 12
  return !!porps.children && <>
    <div
      style={{
        position: 'absolute',
        left: 5 * fp,
        bottom: 2 * fp,
        // right: 3 * @float-padding + 60px,
        zIndex: 9,
        height: 32,
        width: showSetting ? `calc(100% - ${4 * fp}px - 36px)` : 0,
        background: 'var(--theme-bg)',
        overflow: 'hidden',
        borderRadius: 3,
        boxShadow: '#aaa 3px 3px 5px 1px',
        opacity: showSetting ? 1 : 0,
        transition: 'all 0.2s ease-out',
      }}
    >
      {
        porps.children
      }
    </div>
    <div
      style={{
        position: 'absolute',
        bottom: 2 * fp,
        left: 2 * fp,
        zIndex: 99,
      }}
    >
      <Button
        icon={<LegacyIcon type={showSetting ? 'left' : 'right'} />}
        shape={showSetting ? 'circle' : null}
        style={{ boxShadow: '#aaa 3px 3px 5px 1px' }}
        className={styles.btn}
        type="primary"
        onClick={toggleTool}
      />
    </div>

  </>;
}

export default Bar