import {Form, Input, Select} from "antd";
import ModalFormUseForm from "../Common/Form/ModalFormUseForm";
import TextArea from "antd/es/input/TextArea";
import '../../Config/CSS/HeightModal.css'
import {useEffect, useState} from "react";
import {Api} from "../../API/api";

export const SDUSubmit = (props: any) => {
    return (
        <ModalFormUseForm
            btnType={'text'}
            btnName={'提交'}
            width={'1000px'}
            TableName={`SubmissionList${props.contestId}${props.problemCode}`}
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
                                        props.judgeTemplates.map((opt: any) => {
                                            return (<Select.Option value={opt.id}>{opt.title}</Select.Option>)
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
                            <Form.Item name={'problemCode'} initialValue={props.problemCode} style={{display:'none'}}></Form.Item>
                            <Form.Item name={'contestId'} initialValue={props.contestId} style={{display:'none'}}></Form.Item>
                        </>
                    ),
                    label: ''
                }
            ]}
            dataSubmitter={async (data:any)=>{
                // console.log('提交内容',data);
                return Api.contestSubmit({data:{...data}})
            }}
        />
    )
}