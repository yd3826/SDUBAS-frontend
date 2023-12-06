import {Button, Modal} from "antd";
import React, {useEffect, useState} from "react";
import TableWithPagination from "./Table/TableWithPagination";
import {Api} from "../../API/api";
import ValidButton from "../Record/ValidButton";
import {useSelector} from "react-redux";
import {IState} from "../../Type/base";
import {useDispatch} from "../../Redux/Store";
import {Pass, Reject} from "../../Page/OperationRecords";

export const WorkLog = (props: any) => {
    const dataSource = useSelector((state: IState) => state.TableReducer.tableData[`${props.service_type}${props.service_id}BlockchainTable`])
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPass, setIsPass] = useState<any>(undefined);
    useEffect(() => {
        setIsPass(undefined);
    }, [dataSource?.tablePageInfo?.pageNow])
    const dispatch = useDispatch();
    const setDataSource = (data: any, name: string) => {
        return dispatch({type: 'setDataSource', data: data, name: name, add: true})
    }

    const onClick = () => {
        if (dataSource) {
            setLoading(true)
            const ids = dataSource['dataSource'].map((d: any) => d.id)
            Api.getValidAll({data: {id_list: ids}}).then((res: any) => {
                let flag = true;
                const data = dataSource['dataSource'].map((d: any, index: number) => {
                    if (res[index].verify === false) {
                        flag = false
                    }
                    return {
                        ...d,
                        result: res[index].verify,
                        block_number: res[index].block_number,
                        blockchain_hash: res[index].blockchain_hash
                    }
                })
                setIsPass(flag)
                setDataSource(data, `${props.service_type}${props.service_id}BlockchainTable`);
                setLoading(false);
            })
                .catch(() => {
                    setLoading(false)
                })
        }
    }
    return (
        <>
            <Button type={props.btnType} onClick={() => {
                setVisible(true)
            }}>区块链记录</Button>
            <Modal
                title={"区块链记录"}
                onCancel={() => {
                    setVisible(false)
                }}
                open={visible}
                footer={null}
                width={'1500px'}
            >
                <div style={{marginLeft: '90%'}}>
                    {
                        isPass === undefined ?
                            <Button style={{}} onClick={onClick} loading={loading}>全部验证</Button> : (isPass ?
                                <Pass/> :
                                <Reject/>)
                    }
                </div>
                <TableWithPagination
                    API={async (data: any) => {
                        return Api.getOperationLogs({
                            data: {
                                ...data,
                                service_type: props.service_type,
                                service_id: props.service_id
                            }
                        })
                    }}
                    name={`${props.service_type}${props.service_id}BlockchainTable`}
                    columns={[
                        {
                            title: '操作',
                            key: 'operation',
                            dataIndex: 'func',
                        },
                        {
                            title: '时间',
                            key: 'time',
                            dataIndex: 'oper_dt',
                        },
                        {
                            title: '本地hash',
                            key: 'local_hash',
                            dataIndex: 'local_hash',
                            render:(hash:string)=>{
                                return <div style={{ wordBreak: 'break-all', width: '100px' }}>{hash}</div>
                            }
                        },
                        {
                            title: '验证结果',
                            key: 'result',
                            dataIndex: 'result',
                            render: (pass: any, record: any, index: number) => {
                                return (
                                    <ValidButton record={record} loading={loading} isPass={record?.result} index={index}
                                                 setDataSource={setDataSource}
                                                 TableName={`${props.service_type}${props.service_id}BlockchainTable`}/>
                                )
                            },
                        },
                        {
                            title: '区块链hash',
                            key: 'blockchain_hash',
                            dataIndex: "blockchain_hash",
                            render:(hash:string)=>{
                                return <div style={{ wordBreak: 'break-all', width: '100px' }}>{hash}</div>
                            }
                        },
                        {
                            title: '区块号',
                            key: 'block_number',
                            dataIndex: 'block_number',
                            render: (block_number: number) => {
                                return (block_number === undefined ? (<>未验证</>) : (<>{block_number}</>))
                            },
                        }
                    ]}
                />
            </Modal>
        </>
    )
}