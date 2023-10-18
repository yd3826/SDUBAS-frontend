import {Button, Form, Input, message, Modal, Upload} from "antd";
import {InboxOutlined, UploadOutlined} from "@ant-design/icons";
import {calculateHash} from "../../../../Utils/fileUpload";
import {useEffect, useState} from "react";
import {Api} from "../../../../API/api";
import {isValueEmpty} from "../../../../Utils/isValueEmpty";
import {useDispatch} from "../../../../Redux/Store";
import {useSelector} from "react-redux";
import {IState} from "../../../../Type/base";
import {encrypt} from "../../../../Utils/encrypt";
import JSEncrypt from 'jsencrypt';

const {Dragger} = Upload;
const UploadFile = (props: any) => {
    const [visible, setVisible] = useState(false);
    const {value, onChange} = props;
    const [fileName, setFileName] = useState(value?.name || '');
    const {AESKey,RSAPbKey} = useSelector((state:IState)=>state.KeyReducer)

    const dispatch = useDispatch();
    const setRSAPbKey = (data:any)=>{
        dispatch({type:'setRSAPbKey',data:data})
    }

    useEffect(() => {
        if (value?.name)
            onChange(value.file_id);
    }, [])

    let nameList: string[] = []
    for (let nm of props.accept.split(",")) {
        nameList.push("*" + nm)
    }
    const callback = (value: any) => {
        onChange(value.file_id)
    }

    const preUpload = async (file: any) => {
        const code = await calculateHash(file);
        const fileType = file.type;
        let duration: number | null = null;
        if (fileType.startsWith("video/")) {
            const url = window.URL.createObjectURL(file);
            const audioElement = new Audio(url);
            audioElement.addEventListener("loadedmetadata", function (_event) {
                duration = audioElement.duration;
            });
        }
        // console.log({time:duration})
        const size = file.size;
        return new Promise<void>((resolve, reject) => {
            let data;
            if(duration)
                data = {size: size, ...code,time:duration}
            else
                data = {size: size, ...code}
            Api.checkFile({data: data})
                .then((res: any) => {
                    if (res.file_id !== null) {
                        callback(res);
                        setFileName(file.name);
                        setVisible(false);
                        return reject();
                    } else {
                        setRSAPbKey(res.key)
                        return resolve();
                    }
                })
        })
    }

    const handleUpload = async (file: any) => {
        const formData = new FormData();
        if(props.aes)
        {
            const encryptedFile = await encrypt(file,AESKey);
            formData.append('file',encryptedFile);
            const rsaEncrypt = new JSEncrypt();
            rsaEncrypt.setPublicKey(RSAPbKey);
            const encryptedAESKey =  rsaEncrypt.encrypt(AESKey);
            if(encryptedAESKey)
                formData.append('AESKey',encryptedAESKey)
        }else{
            formData.append('file',file);
        }
        Api.uploadFile({data: formData})
            .then((res: any) => {
                message.success('上传成功')
                setFileName(file.name);
                setVisible(false);
                callback(res);
            })
            .catch(() => {
                message.error('上传失败，请重新上传')
            })
    }
    return (
        <>
            {!isValueEmpty(value) ? (
                <div>
                    <Button type={'link'} onClick={() => {
                        Api.getDownLoadUrl({data: {id: value.file_id ? value.file_id : value}}).then((data: any) => {
                            window.open(data.url);
                        })
                    }}>{fileName}</Button>
                    <Button danger onClick={() => {
                        setVisible(true);
                        onChange(null);
                    }}>重新上传</Button>
                </div>
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
                </Dragger>
            </Modal>
        </>

    )

}
const ItemUpload = (props: any) => {
    return (
        <Form.Item
            name={props.name ?? 'file_id'}
            label={props.label??'上传文件'}
            {...props}
        >
            <UploadFile {...props} />
        </Form.Item>
    );
}

export default ItemUpload;