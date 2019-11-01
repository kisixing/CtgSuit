import React from 'react'
import {Empty} from 'antd'
import blank from "@/assets/blank.jpg";
export default props=>{
    return <Empty image={blank} {...props} />
}