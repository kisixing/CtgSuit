
import React, { useState, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import { Pagination, Spin, Icon } from 'antd';
import Empty from '@/components/Empty'
import 'react-pdf/dist/Page/AnnotationLayer.css';


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
        const { height, width } = props.wh;
        setFullpage(true)
        setHeight(height - 24);
        setWidth(width)
    }
    const shrink = () => {
        setFullpage(false)
        setHeight(200);
        setWidth('100%')
    }
    const content = pdfBase64 ? (
        <div style={{
            width, ...(isFullpage ? {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
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
                <Page style={{ display: 'inline-block' }} pageNumber={pageNumber} scale={1} height={height} />
            </Document>
            <Pagination

                total={numPages}
                showTotal={total => `共 ${total} 页`}
                current={pageNumber}
                pageSize={1}
                size="small"
                onChange={onChangePage}
            />
            <span style={{ position: 'absolute', top: 24, right: 24, }}>
                {isFullpage ? <Icon title="缩小" onClick={shrink} type="fullscreen-exit" /> : <Icon title="全屏" onClick={largen} type="fullscreen" />}
            </span>
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