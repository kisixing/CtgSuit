import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { Menu, Spin } from 'antd';
import moment from 'moment';
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
    arr.sort(compare('value'));
  }

  const [currentReport, setCurrentReport] = useState(arr[0]['key']);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    request
      .get('/ctg-exams-pdf', {
        params: {
          report: value,
        },
      })
      .then(({ pdfdata }) => {
        pdfdata && setPdfBase64(`data:application/pdf;base64,${pdfdata}`);
        setLoading(false);
      });
  };

  const handleClick = ({ key }) => {
    setCurrentReport(key);
    fetchpdf(key);
  };

  function compare(key) {
    return function(value1, value2) {
      const val1 = value1[key];
      const val2 = value2[key];
      const v1 = moment(val1).valueOf();
      const v2 = moment(val2).valueOf();
      return v2 - v1;
    };
  }

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
          <Spin spinning={loading}>
            <PreviewContent
              pdfBase64={pdfBase64}
              wh={wh}
              isFull
              borderd={false}
            />
          </Spin>
        </div>
      </div>
    </Shell>
  );
}

export default ReportPreview;
