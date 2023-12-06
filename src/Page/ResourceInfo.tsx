import {Button, Card, Space} from "antd";
import TableWithPagination from "../Component/Common/Table/TableWithPagination";
import '../Config/CSS/ResourceInfo.css'
import {Api} from "../API/api";
import RequestResource from "../Component/Record/Form/Request";
import React, {useEffect, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import ModalFormUseForm from "../Component/Common/Form/ModalFormUseForm";
import {ResourceForm} from "../Component/Record/ResourceProfile";

const {Meta} = Card;


const ResourceInfo = () => {
    const {rId} = useParams();
    const location = useLocation();
    const {row} = location.state;
    const [permissions,setPermissions] = useState<any>([]);
    useEffect(() => {
        Api.getUserPermission({data: {service_type: 5,service_id:row.Id}})
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
                extra={(
                    <Space>
                        {/*<Approval*/}
                        {/*    API={async (data: any) => {*/}
                        {/*        return Api.getApplyInfo()*/}
                        {/*    }}*/}
                        {/*    columns={ApprovalColumns({API: 'null'})}*/}
                        {/*    TableName={'Resource' + rId + 'ApplyTable'}*/}
                        {/*/>*/}
                        {
                            // permissions.some((e: any) => e === '资源申请') && (
                                <RequestResource rId={rId}
                                                 button={<Button type={'primary'} size={'small'}
                                                                 style={{marginTop: '20px'}}>申请</Button>}
                                                 TableName={'ApplicationTable'}/>
                            // )
                        }
                        {
                            // permissions.some((e: any) => e === '资源编辑') && (
                                <ModalFormUseForm
                                    title={'编辑资源'}
                                    type={'update'}
                                    TableName={'ApplicationTable'}
                                    btnName={'编辑'}
                                    width={1000}
                                    subForm={[
                                        {
                                            component: ResourceForm,
                                            label: '',
                                        },
                                        // {
                                        //     component: ProjectForm2,
                                        //     label:'',
                                        // }
                                    ]}
                                    initData={row}
                                    dataSubmitter={async (value: any) => {
                                        // console.log('data:',value);
                                        return Api.updateResource({data: value, rId: row.Id})
                                    }}
                                />
                            // )
                        }
                    </Space>
                )}
            >
                <div className={'fund-info-card'}>
                    <Meta description={'资源数目:' + row.count}/>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{width: '1000px'}}>
                        <TableWithPagination
                            name={'ApplicationTable'}
                            API={async (data: any) => {
                                return Api.getApplyInfo({rId: rId, data: data})
                            }}
                            defaultPageSize={2}
                            columns={[
                                {
                                    title: '申请人',
                                    dataIndex: 'user_name',
                                    key: 'operator'
                                },
                                {
                                    title: '申请时间',
                                    dataIndex: 'time',
                                    key: 'date'
                                },
                                {
                                    title: '时间段',
                                    key: 'range',
                                    render: (_: any, record: any) => {
                                        const hour = [Math.floor(record.start_time / 1), Math.floor(record.end_time / 1)]
                                        const minute = [(record.start_time % 1) * 60, (record.end_time % 1) * 60]
                                        return (
                                            <>{hour[0].toString().padStart(2, '0')}:{minute[0].toString().padStart(2, '0')} - {hour[1].toString().padStart(2, '0')}:{minute[1].toString().padStart(2, '0')}</>
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

export default ResourceInfo;
