import {Button, Card, Image, message} from "antd";
import TableWithPagination from "../Component/Common/Table/TableWithPagination";
import AddBill from "../Component/Record/Form/AddBill";
import '../Config/CSS/FundInfo.css'
import {Api} from "../API/api";
import {useLocation, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import getData from "../API/getData";
import DeleteConfirm from "../Component/Common/DeleteConfirm";
import {useDispatch} from "../Redux/Store";
import ModalFormUseForm from "../Component/Common/Form/ModalFormUseForm";
import ItemName from "../Component/Common/Form/Item/ItemName";
import ItemText from "../Component/Common/Form/Item/ItemText";
import RoleManageForm from "../Component/Permission/Form/RoleManageForm";

const FundForm = (
    <>
        <ItemName label={'资金名称'} name={'name'} required={true} disabled={true}/>
        <ItemText label={'备注'} name={'note'}/>
        <RoleManageForm service_type={6}/>
    </>
);
const {Meta} = Card;
const FundInfo = () => {

    const {fId} = useParams();
    const location = useLocation();
    const {row} = location.state;
    const dispatch = useDispatch();
    const [permissions,setPermissions] = useState<any>([])
    const addTableVersion = (name: string) => {
        dispatch({type: 'addTableVersion', name: name})
    }
    useEffect(() => {
        Api.getUserPermission({data: {service_type: 6,service_id:row.Id}})
            .then((res: any) => {
                    setPermissions(res.map((e: any) => e.label))
                }
            )
    }, [])
    return (
        <>
            <Card
                title={row.name}
                headStyle={{textAlign: 'left'}}
                extra={
                    (<>
                            {
                                // permissions.some((e: any) => e === '资金管理') && (
                                    <>
                                        <AddBill fId={fId}
                                                 button={<Button type={"primary"} size={'small'}
                                                                 style={{marginLeft: '1000px'}}>记账</Button>}/>
                                        <ModalFormUseForm
                                            title={'编辑资金'}
                                            type={'update'}
                                            btnName={'编辑'}
                                            subForm={[
                                                {
                                                    component: FundForm,
                                                    label: '',
                                                },
                                                // {
                                                //     component: ProjectForm2,
                                                //     label:'',
                                                // }
                                            ]}
                                            initData={row}
                                            width={1000}
                                            dataSubmitter={(value: any) => {
                                                return Api.updateFund({fId: fId, data: value})
                                            }}
                                        />
                                    </>
                                // )
                            }
                        </>
                    )
                }
            >
                <div className="fund-info-card">
                    <Meta title={'备注'} description={row.note}/>
                    {/*<EditCard*/}
                    {/*    title={'资金备注'}*/}
                    {/*    API={async (data: any) => {*/}
                    {/*        return Api.updateNote({fId: fId, data: data})*/}
                    {/*    }}*/}
                    {/*    content={row.note}*/}
                    {/*/>*/}
                </div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{width: '1000px'}}>
                        <TableWithPagination
                            name={'AccountTable'}
                            API={async (data: any) => {
                                return Api.getFundInfo({fId: fId, data: data})
                            }}
                            columns={[
                                {
                                    title: '数额',
                                    dataIndex: 'amount',
                                    key: 'amount',
                                    render: (amount: number, row: any) => {
                                        const color = row.state === 0 ? "green" : "red";
                                        return (
                                            <span style={{color}}>
                                                {row.state === 0 ? "+" : "-"}{amount}
                                            </span>
                                        )
                                    }
                                },
                                {
                                    title: '日志记录',
                                    key: 'log_content',
                                    render: (_: any, record: any) => {
                                        if (record.url !== undefined)
                                            return (<img alt={'日志'} src={record.url}/>)
                                        return <>{record.log_content}</>
                                    }
                                },
                                {
                                    title: '操作',
                                    key: 'operator',
                                    render: (_: any, row: any) => {
                                        return (
                                            <DeleteConfirm
                                                onConfirm={() => {
                                                    dispatch(getData(
                                                        'deleteAccount',
                                                        {fId: row.finance_id, aId: row.Id},
                                                        (res: any) => {
                                                            addTableVersion('AccountTable');
                                                            message.success('删除成功')
                                                            return Promise.resolve(res);
                                                        },
                                                        (error: any) => {
                                                            message.error('删除失败');
                                                        }
                                                    ));
                                                }}//删除的Api
                                                content={
                                                    <Button type={'link'} danger={true}>删除</Button>
                                                }
                                            />
                                        )
                                    }
                                },
                            ]}
                        />
                    </div>
                </div>
            </Card>
        </>
    )
}

export default FundInfo;
// .my-cards {
//     display: flex;
//     justify-content: center;
//     align-items: flex-start;
// }
//
// .my-card {
//     margin: 0 10px;
//     width: 300px;
// }