import React, {useEffect, useState} from "react";
import {Button} from "antd";
import {Api} from "../../API/api";
import {CheckCircleTwoTone, CloseCircleOutlined, CloseOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {IState} from "../../Type/base";

const ValidButton = (props: any) => {
    const [loadings, setLoadings] = useState<boolean>(false);
    const dataSource = useSelector((state: IState) => state.TableReducer.tableData[props.TableName])
    const [res, setRes] = useState<boolean | undefined>(undefined)
    useEffect(() => {
        setRes(props.isPass);
    }, [props.isPass])
    const enterLoading = () => {
        setLoadings(true);
        Api.getValidAll({data:{id_list: [props.record.id]}})
            .then((data: any) => {
                setRes(data[0].verify);
                const dt = dataSource['dataSource']
                console.log(dt['dataSource'][props.index])
                dt['dataSource'][props.index] = {...dt['dataSource'][props.index],result:data[0].verify,block_number:data[0].block_number,blockchain_hash:data[0].blockchain_hash}
                props.setDataSource(dt,props.TableName);
            }).catch(() => {
            setLoadings(false)
        })
    };
    return (
        <>
            {
                res === undefined && (
                    <Button
                        type="link"
                        onClick={() => enterLoading()}
                        loading={props.loading || loadings}
                    >
                        验证
                    </Button>
                )
            }
            {
                res === true && (
                    <Button icon={<CheckCircleTwoTone twoToneColor={"#52c41a"}/>} type={'ghost'} disabled={true}/>
                )
            }
            {
                res === false && (
                    <Button icon={<CloseCircleOutlined style={{color: 'red'}}/>} type={'ghost'} disabled={true}/>
                )
            }
        </>
    )
}
export default ValidButton;
