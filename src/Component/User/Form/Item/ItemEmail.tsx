import {Button, Form, Input, message, Modal} from "antd";
import React, {useEffect, useState} from "react";
import {withTranslation} from "react-i18next";
import {Api} from "../../../../API/api";
import ItemCaptcha from "./ItemCaptcha";

export interface ItemEmailProps {
    needVerify: boolean
    editable: boolean
    getEmail: any
}

const ItemEmail = (props: ItemEmailProps & any) => {
    const [canSend, setCanSend] = useState<number>(0);
    const [modalVis, setModalVis] = useState<boolean>(false);
    const [imgId, setImgId] = useState<string>("")
    const [captcha, setCaptcha] = useState<string>('')
    const [captchaV,setCaptchaV] = useState<number>(0)
    const [email, setEmail] = useState<string>("")

    const reduce = () => {
        if (canSend > 0) {
            setCanSend(canSend - 1)
        }
    }
    useEffect(() => {
        let intervalId = setInterval(() => reduce(), 1000)
        return () => clearInterval(intervalId)
    })

    return (
        <>
            {props.needVerify === false && (
                <Form.Item name="email" label={"邮箱"}
                           rules={props.notCheck !== true ? [
                               {type: 'email', message: ('邮箱错误')},
                               {required: props.editable !== false}
                           ] : undefined}
                           hasFeedback>
                    <Input
                        disabled={props.editable === false}
                        bordered={props.editable !== false}
                    />
                </Form.Item>
            )}
            {props.needVerify === true && (
                <>
                    <Modal
                        title={"人机身份认证"}
                        open={modalVis}
                        maskClosable={false}
                        destroyOnClose={true}
                        onOk={() => {
                            Api.sendVerificationEmail({
                                data: {
                                    username:props.username || undefined,
                                    password:props.pwd || undefined,
                                    email: email,
                                    captcha: captcha,
                                    captchaId: imgId.toString(),
                                    type: props.type
                                }
                            }).then((res: any) => {
                                message.success("验证码已发送至您的邮箱")
                                setCanSend(60);
                                setModalVis(false)
                            }).catch(() => {
                                setCaptchaV(captchaV+1);
                            })
                        }}
                        onCancel={() => {
                            setModalVis(false)
                        }}
                    >
                        <ItemCaptcha
                            setImgId={setImgId}
                            setCaptcha={setCaptcha}
                            cap={captchaV}//填写失败时通知组件刷新
                        />
                    </Modal>
                    <Form.Item name="email" label={"邮箱"}
                               rules={[
                                   {type: 'email', message: "邮箱错误",},
                                   {required: true},
                                   ({getFieldValue}) => (props.exist&&{
                                       validator(_, value) {
                                           return Api.isExist({data: {email: value}}).then((data: any) => {
                                               if (data === true) return Promise.resolve()
                                               else if (data === false) return Promise.reject("邮箱已存在")
                                               return Promise.reject("检验失败")
                                           }).catch((e: any) => {
                                           })
                                       },
                                   }),
                               ]}>
                        <Input
                            disabled={props.editable === false || canSend > 0}
                            bordered={props.editable !== false}
                            addonAfter={
                                <Button
                                    type={"text"}
                                    disabled={canSend !== 0}
                                    onClick={() => {
                                        props.getEmail().then((data: string) => {
                                            setEmail(data)
                                            setModalVis(true)
                                        }).catch(() => {
                                        })
                                    }}
                                >
                                    {(canSend !== 0 ? canSend + "s" : "验证")}
                                </Button>
                            }/>
                    </Form.Item>
                    <Form.Item name={props.name?props.name:"captcha"} label={"邮箱验证码"}
                               rules={[{required: true}]}>
                        <Input/>
                    </Form.Item>
                </>
            )}
        </>
    )
}

export default withTranslation()(ItemEmail)