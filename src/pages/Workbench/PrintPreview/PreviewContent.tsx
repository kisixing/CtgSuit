
import React, { useState, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import { Pagination, Spin, Icon, Button } from 'antd';
import Empty from '@/components/Empty'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import './react-pdf.css';


const PreviewContent = props => {
    const { pdfBase64 } = props;
    const [isFullpage, setFullpage] = useState(false);
    const [height, setHeight] = useState(200); //
    const [width, setWidth] = useState('100%')
    const [numPages, setNumPages] = useState(0)
    const [pageNumber, setPageNumber] = useState(1)
    const onDocumentLoad = useCallback(({ numPages }) => { setNumPages(numPages) }, [])
    const onChangePage = useCallback(page => { setPageNumber(page) }, [])

    const largen = () => {
        const { h, w } = props.wh;
        setFullpage(true)
        setHeight(h - 24);
        setWidth(w)
    }
    const shrink = () => {
        setFullpage(false)
        setHeight(200);
        setWidth('100%')
    }
    const content = pdfBase64 ? (
        <div style={{
            width: width,
             ...(isFullpage ? {
                position: 'absolute',
                top: 0,
                left: 0,
                background: '#fff'
            } : {})
        }
        }>
            <Document
                loading={<Spin style={{ margin: '120px 0' }} />}
                onLoadSuccess={onDocumentLoad}
                file={pdfBase64}
                renderMode="canvas"
                options={{
                    cMapUrl: 'cmaps/',
                    cMapPacked: true,
                }}
            >
                <Page pageNumber={pageNumber} scale={1} height={height} />
            </Document>
            <Pagination
                total={numPages}
                showTotal={total => `共 ${total} 页`}
                current={pageNumber}
                pageSize={1}
                size="small"
                onChange={onChangePage}
            />
            {isFullpage ? (
                <span style={{ position: 'absolute', top: 24, right: 24, cursor: 'pointer' }} onClick={shrink}>
                    返回<Icon title="缩小" type="fullscreen-exit" />
                </span>
            ) : (
                <span style={{ position: 'absolute', bottom: 36, right: 12, }}>
                    <Button
                        title="全屏"
                        type="primary"
                        // icon="fullscreen"
                        onClick={largen}
                    >
                        放大预览
                    </Button>
                </span>
            )}
        </div >
    ) : (
            <Empty style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', margin: 0 }} />
        );
    return (
        <div style={{
            position: 'relative',
            flex: 1,
            background: '#fff',
            marginRight: 12,
            zIndex: 99,
            border: '1px solid #eee',
        }
        } >
            {content}
        </div >
    )
}

export default PreviewContent