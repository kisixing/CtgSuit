import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import PreviewContent from "@lianmed/pages/lib/Ctg/Report/PreviewContent";
import Shell from "../Workbench/Analysis/Shell";
import { request } from "@lianmed/utils";
interface IProps {
  report: string
  docid: string
  visible: boolean
  onCancel: () => void
  inpatientNO: string
  name: string
  age: number
  startTime: string
  gestationalWeek: string
}
export const Context = React.createContext({});
function Analysis(props: IProps) {
  const { report = '' } = props

  const [pdfBase64, setPdfBase64] = useState('')
  const inputEl = useRef(null)
  const [wh, setWh] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const { clientHeight, clientWidth } = inputEl.current;
    setWh({ h: clientHeight, w: clientWidth })
  }, [])

  useEffect(() => {
    request.get('/ctg-exams-pdf', {
      params: {
        report
      }
    }).then(({ pdfdata }) => {
      pdfdata && setPdfBase64(`data:application/pdf;base64,${pdfdata}`)
    })
  }, [])

  return (
    <Shell {...props}>
      <div style={{ height: '100%', textAlign: 'center', display: 'flex' }} ref={inputEl}>
        <PreviewContent pdfBase64={pdfBase64} wh={wh} isFull borderd={false} />
      </div>
    </Shell>
  );
}

export default Analysis;
