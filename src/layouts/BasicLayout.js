/*
 * @Description: 上下布局，主要页面布局 header-main
 * @Author: Zhong Jun
 * @Date: 2019-09-23 20:34:58
 */

import React, { Component } from 'react';

class componentName extends Component {
  render () {
    const { children } = this.props;
    return (
      <div>
        {children}
      </div>
    )
  }
}

componentName.propTypes = {

}

export default componentName;
