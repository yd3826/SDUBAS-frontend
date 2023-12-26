import {Form, Input} from "antd";
import React from "react";
import {withTranslation} from "react-i18next";
import {Api} from "../../../../API/api";

const ItemUsername = (props: any) => {
    return (
        <Form.Item
            name="username"
            label={'用户名'}
            rules={
                [
                    {
                        required:
                            props.editable !== false && props.notRequired !== true,
                        message: "usernameEmpty"
                    },
                    ({getFieldValue}) => ({
                        validator(_, value) {
                            if (props.ExistCheck === true) {
                                return Api.isExist({data: {username: value}}).then((data: any) => {
                                    // console.log('data', data);
                                    if (data === true) return Promise.resolve()
                                    else if (data === false) return Promise.reject("用户名已存在")
                                    return Promise.reject("检验失败")
                                }).catch((e: any) => {
                                    return Promise.reject(e)
                                })
                            }
                            return Promise.resolve()
                        },
                    }),
                ]
            }
            hasFeedback>
            <Input
                disabled={props.editable === false}
                bordered={props.editable}
                onChange={(e) => {
                    if(props.onChange)
                        props.onChange(e.target.value)
                    else return
                }}
            />
        </Form.Item>
    )
}

export default withTranslation()(ItemUsername)