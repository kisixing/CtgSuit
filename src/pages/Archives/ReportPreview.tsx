import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { Menu } from 'antd';
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
function ReportPreview(props: IProps) {
  const { report = '' } = props;
  let reportObj = {};
  try {
    reportObj = JSON.parse(report);
  } catch (error) {
    console.log('report格式不正确', error);
    return null;
  }

  // 是否为对象
  const isObj = Object.prototype.toString.call(reportObj);
  if (!isObj) {
    return null;
  }
  const arr = [];
  for (let key in reportObj) {
    const obj = { key, value: reportObj[key] };
    arr.push(obj);
  }

  const [currentReport, setCurrentReport] = useState(arr[0]['key']);
  const [pdfBase64, setPdfBase64] = useState('');
  const inputEl = useRef(null);
  const [wh, setWh] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const { clientHeight, clientWidth } = inputEl.current;
    setWh({ h: clientHeight, w: clientWidth - 176 });
  }, []);

  useEffect(() => {
    fetchpdf(currentReport);
  }, []);

  const fetchpdf = (value: string) => {
    request
      .get('/ctg-exams-pdf', {
        params: {
          report: value,
        },
      })
      .then(({ pdfdata }) => {
        pdfdata && setPdfBase64(`data:application/pdf;base64,${pdfdata}`);
      });
  };

  const handleClick = ({ key }) => {
    setCurrentReport(key);
    fetchpdf(key);
  };

  return (
    <Shell {...props}>
      <div
        style={{ height: '100%', textAlign: 'center', display: 'flex' }}
        ref={inputEl}
      >
        <Menu
          style={{ width: 176 }}
          defaultSelectedKeys={[currentReport]}
          theme="light"
          onClick={handleClick}
        >
          {arr &&
            arr.map(e => {
              return (
                <Menu.Item key={e.key}>
                  <div>{e.key}</div>
                  <div>{e.value}</div>
                </Menu.Item>
              );
            })}
        </Menu>
        <div style={{ flex: 1 }}>
          <PreviewContent
            pdfBase64={pdfBase64}
            wh={wh}
            isFull
            borderd={false}
          />
        </div>
      </div>
    </Shell>
  );
}

export default ReportPreview;
