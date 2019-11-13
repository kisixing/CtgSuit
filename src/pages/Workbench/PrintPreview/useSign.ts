
import { useState, useEffect } from 'react';
import request from "@lianmed/request";




export default (docid: string) => {


    const [qrCodeBase64, setQrCodeBase64] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    useEffect(() => {

    }, [])

    const signHandler = () => {
        request.post('/ca/signreq', {
            data: {
                action: "sign",
                docid
            }
        }).then(r => {
            setQrCodeBase64(r && r.data)
            setModalVisible(true)
        }).catch(r => {
            setModalVisible(true)
            setQrCodeBase64('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAV4AAAFeAQAAAADlUEq3AAADj0lEQVR42u1bQa7rMAhE8gFyJF/dR/IBLPHNDOC8Lr7e8sk0qqo0mWSBYICBiv7+WPIFf8F/Hix29CXS7LyvZ+wbbYo82nTsKzoN0WqAN0Zn3xf3rY1Zz/4p9ohdlH2+T+zxIuApbW7TddhqH2Pj90ceO9lviFcVApuVzG22/wwznf10q7Z6YDOdmMPQfwSW3O60LKwqgcM++wT+Y1fsXLYBO8EfMXgxmIZq8z+fT36+GOy5FkbbkcVoQgKy+Gqw20fuvhhsZkHy5SM7lEA19C7LRODeUQWMdLNvLdrK7Gb+s7w4Eb6kFQEbmZiJQCyddkuyZf3WXo50N9gqNFQgAIjz7aMMKHybLxUBi7BA7VG9v8LKc5PFXREwCGSgPmEN34FnCh54ych0fD24oUxlUkYLg0fQ3An9ypgnvO52sCDFWPhMr82E/R1NGpzcaoDZ4VIBoOkaDYj6bYFvk3KvB5NUQSMUQxSWpDsp40ueDKvbwcG6KYawMmFqBl70pOPLwSxFmG5IvKaHeHBBGXi0Engwjkg1AqNZ3kH56gqJSBEwG5nGjAxz6SlWB/EwbAmwujQk0fYOPycDM+iicL0e3JTpWCJ8SLBOwgskDNsWAavzrTtVDCAe5x/qA1oEzK7WidefItuw/W8kohpgefKWemHmxCtRxjMHlQBTBmk6jjTkxAK8K8yjFQGLzxeYg7z9Z70KWeBHOr4eTKbFhCWmkz1syLqlZ1hdD0b+7R5ELM+mj7PR+P8c6N8OpjSU7S2nt6o+tBWv8EerAeaI1rV0uA25l4+resujNcAImRGs0l/S+oCIKhCITljdDV7o7FISWVGkpWz4FtivB1NOhwFTIRw+lQPPsLVpNcDoZyVMx1wzuAATohDawBrg09lFOtbIQbEMw2qtBFhDBmkpjKD5XWd8ObLFux5MndB1IfUNB5fZAfMFoRpgYfhMyfWG0Mc4ZVAXEmuAo8mNXRevUjqpJmhHWw0wR7SSMrLnX9+dC8o9pdrd4CU9s0yuvpzFBnY6r/b/bjDTMU1HsqWKGPJyf8uGBcBHRl6x40G+ReuXM/0S4Fyn1Nwy9S6PC7dZ5JcAc9uHCqH3uTlw4bTuJRveD47JrPcvMzo7X4tyyUiLgZmGuE36kg07NwyLgQdX4yiGrCDbs4pcBJz/0fA1j7F8HHMqWM2NstvB/meNPB4u/4wjG8onP18M/v7n8Qu+BvwPjRxbcMI8bggAAAAASUVORK5CYII=')
        })
    }
    const fetchSigninfo = () => {
        request.post('/ca/signinfo', {
            data: {
                bizSn: docid
            }
        }).then(({ ret, data }) => {
            if (ret === '1') {
                setModalVisible(false)
                data ? alert('签名成功') : alert('签名失败')
            }
            
        }).catch(err => {
            setModalVisible(false)
            alert('签名成功')
        })
    }
    useEffect(() => {
        let timeoutId = modalVisible && setInterval(fetchSigninfo, 1500)
        return () => {
            timeoutId && clearInterval(timeoutId)
        }
    }, [modalVisible])

    return {
        signHandler, qrCodeBase64, modalVisible, setModalVisible
    }
}