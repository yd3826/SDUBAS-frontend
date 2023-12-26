import {Button, Form, Input, message, Modal, Progress, Upload} from "antd";
import {InboxOutlined, UploadOutlined} from "@ant-design/icons";
import {calculateHash} from "../../../../Utils/fileUpload";
import {useEffect, useState} from "react";
import {Api} from "../../../../API/api";
import {isValueEmpty} from "../../../../Utils/isValueEmpty";
import {useDispatch} from "../../../../Redux/Store";
import {useSelector} from "react-redux";
import {IState} from "../../../../Type/base";
import {encrypt, generateAESKey} from "../../../../Utils/encrypt";
import JSEncrypt from 'jsencrypt';
import {getBase64} from "../../../../Utils/fileUpload";
import {RcFile} from "antd/es/upload";

const {Dragger} = Upload;


const UploadFile = (props: any) => {
    const {value, onChange} = props;
    const [visible, setVisible] = useState(false);
    // console.log(value)
    const [fileName, setFileName] = useState(value?.file_name);
    const [previewImg, setPreviewImg] = useState('')
    const [fileDd, setFileDd] = useState<any | undefined>(undefined);
    const {RSAPbKey} = useSelector((state: IState) => state.KeyReducer)
    const [AESKey, setAESKey] = useState<any>();
    const [uploadProgress, setUploadProgress] = useState(0);
    const dispatch = useDispatch();
    const setRSAPbKey = (data: any) => {
        dispatch({type: 'setRSAPbKey', data: data})
    }
    //初始传入的参数
    useEffect(() => {
        if (props.value?.file_name) {
            setFileName(value?.file_name)
            //如果是图片需要预览
            if (props.type === 'image') {
                setPreviewImg(value.url);
            } else {
                setFileDd(value.url);
            }
            //将其变为file_id
            onChange(value?.file_id);
        }
    }, [props.value])

    let nameList: string[] = []
    for (let nm of props.accept.split(",")) {
        nameList.push("*" + nm)
    }

    //始终使用file_id作为返回值
    const callback = (value: any) => {
        onChange(value.file_id)
    }

    const preUpload = async (file: any) => {
        if (nameList.some((name: string) => name === '*.' + file.name.split('.').pop())) {
            //大小判断
            if (props.sizeLimit) {
                if (file.size / (1024 * 1024) > props.sizeLimit)//MB
                {
                    return new Promise<void>((resolve, reject) => {
                        message.error('文件大小超过限制');
                        return reject();
                    })
                }
            }
            //如果是图片需要预览
            if (props.type === 'image') {
                const img = await getBase64(file as RcFile);
                setPreviewImg(img);
            }
            //先计算时长
            const fileType = file.type;
            let duration: number | null = null;
            if (fileType.startsWith("video/")) {
                let flag = false;
                const fileSizeInBytes = file.size;
                const url = window.URL.createObjectURL(file);
                const audioElement = new Audio(url);
                audioElement.addEventListener("loadedmetadata", function (_event) {
                    duration = audioElement.duration;
                    const bitrateInBitsPerSecond = (fileSizeInBytes * 8) / duration;
                    if (bitrateInBitsPerSecond >= 10e6) {
                        message.error('视频码率过大');
                        flag = true;
                    }
                });
                if (flag)
                    return false
            }
            //如果需要加密则加密
            if (props.aes) {
                const k = generateAESKey();
                setAESKey(k);
                file = await encrypt(file, k);
                // const file2 = await decrypt(file,k);
            }
            const code = await calculateHash(file);
            // console.log(code);
            const size = file.size;
            return new Promise<void>((resolve, reject) => {
                let data;
                if (duration)
                {
                    data = {size: size, ...code, time: duration}
                }
                else
                    data = {size: size, ...code}
                // console.log(data)
                Api.checkFile({data: {...data, type: props.aes}})
                    .then((res: any) => {
                        if (res.file_id !== null) {
                            callback(res);
                            setFileName(file.name);
                            setVisible(false);
                            return reject();
                        } else {
                            setRSAPbKey(res.public_key)
                            return resolve(file);
                        }
                    }).catch(() => {
                    return reject()
                })
            })
        } else {
            message.error('文件类型不符合要求');
            return false;
        }

    }

    const handleUpload = async (file: any) => {
        const formData = new FormData();
        formData.append('file', file);
        if (props.aes) {
            const rsaEncrypt = new JSEncrypt();
            rsaEncrypt.setPublicKey(RSAPbKey);
            const encryptedAESKey = rsaEncrypt.encrypt(AESKey);
            if (encryptedAESKey)
                formData.append('aes_key', encryptedAESKey);
        } else {
            formData.append('aes_key', ' ');
        }
        const options = {
            onUploadProgress: (progressEvent:any) => {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(progress);
            },
        };
        Api.uploadFile({data: formData},options)
            .then((res: any) => {
                message.success('上传成功')
                setFileName(file.name);
                setVisible(false);
                callback(res);
            })
            .catch(() => {
                // message.error('上传失败，请重新上传')
            })
    }
    return (
        <>
            {!isValueEmpty(value) ? (
                <>
                    {props.type === 'image' ? (<img alt='图片' src={previewImg} style={{
                        height: '80px',
                        marginRight: '20px',
                        marginTop: '10px'
                    }}/>) : (
                        <Button type={'link'} onClick={() => {
                            // console.log(fileDd)
                            if (fileDd !== undefined) window.open(fileDd);
                        }}>{fileName || value?.file_name}</Button>)}
                    <Button danger onClick={() => {
                        setVisible(true);
                        onChange(null);
                    }}>重新上传</Button>
                </>
            ) : (!visible && <Button style={{width: '80px'}} onClick={() => {
                setVisible(true)
            }} icon={<UploadOutlined/>}/>)}
            <Modal
                open={visible}
                onCancel={() => setVisible(false)}
                onOk={() => {
                    setVisible(false)
                }}
            >
                <Dragger
                    // fileList={fileList}
                    maxCount={1}
                    beforeUpload={preUpload}
                    customRequest={({file}) => {
                        handleUpload(file)
                    }}
                    action=''
                    accept={props.accept}
                    multiple={false}
                    showUploadList={false}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined/>
                    </p>
                    <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
                    <p className="ant-upload-hint">
                        请上传一个 {nameList} 文件
                    </p>
                    {uploadProgress > 0 && (
                        <Progress percent={uploadProgress} size="small" />
                    )}
                </Dragger>
            </Modal>
        </>
    )
}
const ItemUpload = (props: any) => {
    return (
        <Form.Item
            name={props.name ?? 'file_id'}
            label={props.label || undefined}
            {...props}
            required={props.required}
            rules={[{
                required: props.required,
            }]}
            // noStyle={props.label===undefined}
        >
            <UploadFile {...props} />
        </Form.Item>
    );
}

export default ItemUpload;