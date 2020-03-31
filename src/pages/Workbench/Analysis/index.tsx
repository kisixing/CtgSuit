import React from 'react';
import { Ctg_Analyse } from "@lianmed/pages";
import Shell from "./Shell";
import { printPdf } from "@/utils";
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
      <Ctg_Analyse docid={docid} {...props} onDownload={() => printPdf(`/ctg-exams-pdfurl/${docid}`)} />
    </Shell>
  );
}

export default Analysis;
