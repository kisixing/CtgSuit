import React from 'react'
import {Empty} from 'antd'
import blank from "@/assets/blank.png";
export default props=>{
    return <Empty image={blank} {...props} />
}