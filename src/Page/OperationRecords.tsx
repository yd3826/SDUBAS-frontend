import React, {useEffect, useState} from "react";
import {Api} from "../API/api";
import {CheckCircleOutlined, CloseOutlined} from "@ant-design/icons";
import TableWithPagination from "../Component/Common/Table/TableWithPagination";
import ValidButton from "../Component/Record/ValidButton";
import {Button, Card, Descriptions} from "antd";
import "../Config/CSS/Table.css";
import {useSelector} from "react-redux";
import {IState} from "../Type/base";
import {useDispatch} from "../Redux/Store";

export const Pass = () => {
    return (
        <div style={{display: 'flex'}}>
            <CheckCircleOutlined style={{color: 'green', fontSize: '24px'}}/>
            <div style={{fontSize: '20px', color: 'green'}}>验证通过</div>
        </div>
    )
}

export const Reject = () => (
    // <div style={{
    //     display: 'flex'
    // }}>
    <div style={{
        display: 'flex',
        // transform: 'translate(80%, -50%)'
    }}
    >
        <CloseOutlined style={{color: 'red', fontSize: '24px'}}/>
        <div style={{fontSize: '20px', color: 'red'}}>验证失败</div>
    </div>
    // {/*</div>*/}
)


const OperationRecords = () => {
    const dataSource = useSelector((state: IState) => state.TableReducer.tableData['OperationsTable'])
    const [isPass, setIsPass] = useState<any>(undefined);
    const [loading, setLoading] = useState(false);
    const [blockInfo, setBlockInfo] = useState<any | undefined>(undefined);
    const dispatch = useDispatch();
    const setDataSource = (data: any, name: string) => {
        return dispatch({type: 'setDataSource', data: data, name: name, add: true})
    }
    function formatTimestamp(timestamp: string): string {
        // 将 "T" 替换为空格
        const formattedTimestamp = timestamp.replace("T", " ");

        // 查找最后一个小数点的索引
        const dotIndex = formattedTimestamp.lastIndexOf(".");

        // 如果存在小数点，则截取小数点之前的部分
        return dotIndex !== -1 ? formattedTimestamp.slice(0, dotIndex) : formattedTimestamp;
    }
    useEffect(() => {
        setIsPass(undefined);
    }, [dataSource?.tablePageInfo?.pageNow])
    useEffect(() => {
        Api.getBlockInfo().then((res: any) => {
            // console.log(res);
            setBlockInfo(res);
        }).catch(() => {
        })
    }, [])
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
                setDataSource(data, 'OperationsTable');
                setLoading(false);
            })
                .catch(() => {
                    setLoading(false)
                })
        }
    }
    return (
        <div
            className={"table-container"}
        >
            <Card
                title={'区块链节点信息'}
                headStyle={{textAlign: 'left'}}
                style={{top: '20px'}}
                extra={
                    <Button type={'primary'} onClick={()=>{
                        Api.getBlockInfo().then((res: any) => {
                            setBlockInfo(res);
                        }).catch(() => {
                        })
                    }}>刷新</Button>
                }
            >
                <Descriptions
                    bordered
                >
                    <Descriptions.Item label={'节点id'}>{blockInfo?.id}</Descriptions.Item>
                    <Descriptions.Item label={'用户数量'}>{blockInfo?.num_cnt}</Descriptions.Item>
                    <Descriptions.Item label={'交易总数'}>{blockInfo?.deal_cnt}</Descriptions.Item>
                    <Descriptions.Item label={'最新区块高度'}>{blockInfo?.latest_block_height}</Descriptions.Item>
                    <Descriptions.Item label={'最新区块时间戳'}>{formatTimestamp(blockInfo?.latest_block_time || '')}</Descriptions.Item>
                    <Descriptions.Item label={'验证者地址'}>{blockInfo?.address}</Descriptions.Item>
                    <Descriptions.Item label={'创世区块时间'}>{formatTimestamp("2023-11-26T06:38:23.283227273Z")}</Descriptions.Item>
                    {/*<Descriptions.Item label={'节点id'}>ddc4b1fd46771dcaabd4e30ed7d8d0039ebc532a</Descriptions.Item>*/}
                    {/*<Descriptions.Item label={'用户数量'}>2573</Descriptions.Item>*/}
                    {/*<Descriptions.Item label={'交易总数'} style={{width:'150px'}}>14235</Descriptions.Item>*/}
                    {/*<Descriptions.Item label={'最新区块高度'}>66710</Descriptions.Item>*/}
                    {/*<Descriptions.Item label={'最新区块时间戳'}>2023-12-04T12:22:39.066334994Z</Descriptions.Item>*/}
                    {/*<Descriptions.Item label={'验证者地址'}>E0013A41EA84B6B77440266DDB8E8CDBDC04E054</Descriptions.Item>*/}
                    {/*<Descriptions.Item label={'创世区块时间'}>2023-11-26T06:38:23.283227273Z</Descriptions.Item>*/}
                </Descriptions>
            </Card>
            <Card
                title={'日志记录'}
                headStyle={{textAlign: 'left'}}
                style={{top: '20px'}}
                extra={
                    isPass === undefined ? <Button style={{
                        // // padding: '10px 20px',
                        // // background: '#f0f0f0',
                        // color: '#333',
                        // border: 'none',
                        // borderRadius: '5px',
                        // boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        // fontSize: '16px',
                        // // fontWeight: 'lighter',
                        // cursor: 'pointer',
                        // transition: 'background 0.3s ease',
                        // top: '50%',
                        // left: '50%',
                        // transform: 'translate(-50%, -50%)',
                    }} onClick={onClick} loading={loading}>全部验证</Button> : (isPass ? <Pass/> :
                        <Reject/>)
                }
            >
                <TableWithPagination
                    API={async (data: any) => {
                        return Api.getOperationLogs({data: data})
                    }}
                    name={'OperationsTable'}
                    columns={[
                        {
                            title: '操作',
                            key: 'operation',
                            dataIndex: 'func',
                            width: '100px'
                        },
                        {
                            title: '时间',
                            key: 'time',
                            dataIndex: 'oper_dt',
                            width: '80px'
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
                                                 setDataSource={setDataSource} TableName={'OperationsTable'}/>
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
            </Card>
        </div>
    );
}

export default OperationRecords;