import {Button, Col, Form, Image, Input, Row} from "antd";
import React, {useEffect, useState} from "react";
import {withTranslation} from "react-i18next";
import {Api} from "../../../../API/api";
import {RedoOutlined} from "@ant-design/icons"

const ItemCaptcha = (props: any) => {

    const [image, setImage] = useState<string>()

    const getCaptcha = () => {
        Api.getCaptcha().then((data:any)=>{
            // console.log(data);
            setImage(data.captcha)
            props.setImgId(data.captchaId)
        }).catch(()=>{})
    }

    useEffect(() => {
        getCaptcha()
    }, [props.cap])

    const content = (
        <Row>
            <Col span={14}>
                <Input onChange={(e) => {
                    if (props.setCaptcha !== undefined)
                        props.setCaptcha(e.target.value)
                }}/>
            </Col>
            <Col offset={1} span={8}>
                <Image src={image} height={32} preview={false}/>
            </Col>
            <Col span={1}>
                <Button
                    icon={<RedoOutlined/>}
                    onClick={() => {
                        getCaptcha()
                    }}/>
            </Col>
        </Row>
    )

    return (
        <>
            {
                [''].map(() => {
                    if (props.setCaptcha !== undefined) {
                        return content
                    } else {
                        return (
                            <Form.Item
                                name="captcha"
                                label={"验证码"}
                                rules={[
                                    {required: true},
                                ]}
                            >
                                {content}
                            </Form.Item>
                        )
                    }
                })
            }
        </>
    )
}

export default withTranslation()(ItemCaptcha)
