import {useState} from "react";
import {Button, Form, Input, message, Modal} from "antd";
import ItemUpload from "../../Common/Form/Item/ItemUpload";
import {ModalForm} from "@ant-design/pro-form";
import {Api} from "../../../API/api";
import {useDispatch} from "../../../Redux/Store";
import ItemText from "./Item/ItemText";
import ReactMarkdown from "react-markdown";


const SubmissionSForm = (props: any) => {
    const [inputValue, setInputValue] = useState('');
    const text = props.rows.commit ? "重新提交" : "提交";
    const dispatch = useDispatch();
    const addTableVersion = (name: string) => {
        dispatch({type: 'addTableVersion', name: name})
    }
    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };


    const button = (props.rows.type === 0 ? (
            <Button type="link">
                {text + "文本"}
            </Button>
        )
        : (
            <Button type="link">
                {text + "文件"}
            </Button>
        ))
    return (
        <>
            <ModalForm
                title={'提交'}
                trigger={button}
                modalProps={{
                    // maskClosable: false,
                    destroyOnClose: true,
                    // width: "1000px",
                    okText: "提交",
                    // bodyStyle:{height:"500px"}
                }}
                onFinish={(values: any) => {
                    // console.log(values);
                    return Api.submit({pId: props.pId, cId: props.cId, data: values}).then(() => {
                        message.success('提交成功');
                        addTableVersion(`SubmitContentTable${props.cId}`);
                        return Promise.resolve(true);
                    }).catch(() => {
                        // message.error('错误')
                    })
                }
                }//需要添加addTableVersion
            >
                {props.rows.type === 0 && (
                    <>
                        <span>字数限制:{props.rows.count_limit}</span>
                        <Form.Item name={'content'} label={'请输入文本'}
                                   rules={[
                                       {required: true, message: '请输入文本'},
                                   ]}
                                   noStyle
                        >
                            <div style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
                                <div>
                                    <div style={{marginBottom: '10px', fontSize: '15px'}}>输入文本:</div>
                                    <Input.TextArea value={inputValue} onChange={handleInputChange}
                                                    placeholder="请输入文本" maxLength={props.rows.count_limit}
                                                    showCount
                                                    style={{height: '400px', width: '400px'}}
                                    />
                                </div>
                                <div>
                                    <div style={{marginBottom: '10px', fontSize: '15px'}}>MarkDown实时渲染:</div>
                                    <div style={{height: '400px', width: '400px',overflow:'auto'}}>
                                        <ReactMarkdown
                                            children={inputValue}
                                        />
                                    </div>
                                </div>

                            </div>
                        </Form.Item>
                    </>
                )}
                {props.rows.type === 1 && (
                    <ItemUpload
                        label={'上传文件'}
                        name={'file_id'}
                        accept={"." + props.rows.type_limit}
                        aes={true}
                    />
                )}
                <Form.Item name={'pc_submit_id'} initialValue={props.rows.id} style={{display: 'none'}}>
                    <Input type={'hidden'}/>
                </Form.Item>
            </ModalForm>
        </>
    )
}

export default SubmissionSForm;