import {Form, Input, Select} from "antd";
import ModalFormUseForm from "../Common/Form/ModalFormUseForm";
import TextArea from "antd/es/input/TextArea";
import '../../Config/CSS/HeightModal.css'

const templateOpts = [
    {
        key: 0,
        value: 'C++14'
    },
    {
        key: 1,
        value: 'Python3.6'
    },
    {
        key: 2,
        value: 'Java8'
    },
    {
        key: 3,
        value: 'C11'
    },
    {
        key: 4,
        value: 'C++17'
    },
    {
        key: 5,
        value: 'Java17'
    },
    {
        key: 6,
        value: 'Python3.11'
    }
]
export const SDUSubmit = (props: any) => {
    return (
        <ModalFormUseForm
            btnType={'text'}
            btnName={'提交'}
            width={'1000px'}
            subForm={[
                {
                    component: (
                        <>
                            <Form.Item
                                name={'judgeTemplateId'}
                                label='评测模板'
                                rules={[
                                    {
                                        required: true,
                                        message: "评测模板不能为空"
                                    }
                                ]}
                            >
                                <Select>
                                    {
                                        templateOpts.map((opt: any) => {
                                            return (<Select.Option value={opt.key}>{opt.value}</Select.Option>)
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name={'code'}
                                label={'代码'}
                                rules={[
                                    {required: true, message: '提交代码'}
                                ]}
                            >
                                    <TextArea
                                        title={'文本'}
                                        style={{width:'100%',height:'400px'}}
                                    />
                            </Form.Item>
                        </>
                    ),
                    label: ''
                }
            ]}
        />
    )
}