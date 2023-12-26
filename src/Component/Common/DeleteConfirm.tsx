import {Popconfirm} from "antd";
import React from "react";
import {withTranslation} from "react-i18next";

const DeleteConfirm = (props: any) => {
    return (
        <Popconfirm
            title={"确认删除"}
            onConfirm={props.onConfirm}
            okText={'确认'}
            cancelText={"取消"}
        >
            {props.content}
        </Popconfirm>
    )
}

export default withTranslation()(DeleteConfirm)


export const Confirm = (props:any)=>{
    return(
        <Popconfirm
            title={props.title}
            onConfirm={props.onConfirm}
            okText={'确认'}
            cancelText={'取消'}
        >
            {props.content}
        </Popconfirm>
    )
}