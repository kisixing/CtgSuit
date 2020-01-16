import React from 'react';
import { Ctg_Analyse } from "@lianmed/pages";
import Shell from "./Shell";
interface IProps {
  docid: string
  visible: boolean
  onCancel: () => void
  inpatientNO: string
  name: string
  age: string
  startTime: string
  gestationalWeek?: string
}
export const Context = React.createContext({});
function Analysis(props: IProps) {
  const { docid = '' } = props
  return (
    <Shell {...props}>
      <Ctg_Analyse docid={docid} />
    </Shell>
  );
}

export default Analysis;
