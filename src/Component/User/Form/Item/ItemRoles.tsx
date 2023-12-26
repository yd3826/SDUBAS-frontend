import {Form, Select} from "antd";
import React from "react";
import {withTranslation} from "react-i18next";

const ItemRoles = (props: any) => {
    return (
        <Form.Item
            name="roles"
            label={"角色"}
            rules={[{required: props.editable, message: 'Please select roles!'}]}
            initialValue={props.value}
        >
            <Select mode="multiple" allowClear
                    disabled={props.editable === false}
                    bordered={props.editable}
            >
                <Select.Option value={"user"}>{("用户")}</Select.Option>
                <Select.Option value={"admin"}>{("管理员")}</Select.Option>
                <Select.Option value={"superadmin"}>{("超级管理员")}</Select.Option>
            </Select>
        </Form.Item>
    )
}

export default withTranslation()(ItemRoles)