import {Form, Input} from "antd";
import React from "react";
import {withTranslation} from "react-i18next";

const ItemStudentId = (props: any) => {
    return (
        <Form.Item
            name="studentId"
            label={"学生Id"}
            initialValue={props.value}
        >
            <Input/>
        </Form.Item>
    )
}

export default withTranslation()(ItemStudentId)