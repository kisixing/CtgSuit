import React, { useState } from 'react';
import { Ctg as L } from '@lianmed/lmg';
import { Context } from './index';
import useCtgData from "@lianmed/pages/lib/Ctg/Analyse/useCtgData";


interface IProps {
  docid: string
}

const Setting = (props: IProps) => {

  const [ctgData] = useCtgData(props.docid)

  return (
    <Context.Consumer>
      {(value: any) => (

        <L suitType={2} loading={(ctgData as any).fhr1 === undefined} data={ctgData} mutableSuitObject={value}></L>
      )}
    </Context.Consumer>
  );
}

export default Setting