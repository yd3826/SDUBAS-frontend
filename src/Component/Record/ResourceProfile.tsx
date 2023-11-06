import TableWithPagination from "../Common/Table/TableWithPagination";
import {Api} from "../../API/api";
import {Button, message, Space} from "antd";
import {useNavigate} from "react-router-dom";
import React from "react";
import {useSelector} from "react-redux";
import {IState} from "../../Type/base";
import ModalFormUseForm from "../Common/Form/ModalFormUseForm";
import ItemName from "../Common/Form/Item/ItemName";
import ItemNumber from "./Form/Item/ItemNumber";
import DeleteConfirm from "../Common/DeleteConfirm";
import getData from "../../API/getData";
import {useDispatch} from "../../Redux/Store";
import RoleManageForm from "../Permission/Form/RoleManageForm";
import ModalRoleManage from "../../Page/School/Component/ModalRoleManage";


export const ResourceForm = (
    <>
        <ItemName label={'资源名称'} name={'name'} required={true}/>
        <ItemNumber label={'资源总数'} name={'count'} required={true}/>
        <RoleManageForm service_type={5}/>
    </>
)
const ResourceProfile = () => {

    const navigate = useNavigate();
    const userInfo = useSelector((state: IState) => state.UserReducer.userInfo);
    const dispatch = useDispatch();
    const addTableVersion = (name: string) => {
        dispatch({type: 'addTableVersion', name: name})
    }
    return (
        <>
            <div style={{
                right: 0, top: 0,
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '20px',
            }}>
                <ModalFormUseForm
                    title={'新建资源项目'}
                    type={'create'}
                    btnName={'新建资源'}
                    TableName={'ResourceTable'}
                    subForm={[
                        {
                            component: ResourceForm,
                            label: "",
                        }
                    ]}
                    dataSubmitter={async (value: any) => {
                        console.log(value);
                        return Api.newResource({data: value});
                    }}
                />
            </div>
            <div className={"table-container"}>
                <TableWithPagination
                    name={'ResourceTable'}
                    API={async (data: any) => {
                        return Api.getResource({data: data})
                    }}
                    columns={[
                        {
                            title: '名称',
                            dataIndex: 'name',
                            key: 'name',
                            render: (title: string, rows: any) => {
                                return (
                                    <Button type={'link'} onClick={() => {
                                        navigate(`/c/resource-info/${rows.Id}`, {state: {row: rows}})
                                    }}>{title}</Button>
                                )
                            },
                            width:"150px"
                        },
                        {
                            title: '状态',
                            dataIndex: 'state',
                            key: 'state',
                            render: (state: any) => {
                                return (state === 1 ? <span>可用</span> : <span>不可用</span>)
                            },
                            width: "150px"
                        },
                        {
                            title: '操作',
                            key: 'operator',
                            render: (_: any, rows: any) => {
                                return (
                                    <>
                                        <ModalRoleManage editable={false} newRole={false} newUser={false}
                                                         btnType={'link'}
                                                         TableName={`Resource${rows.Id}Roles`} service_type={5}
                                                         service_id={rows.Id}/>
                                        <DeleteConfirm
                                            onConfirm={() => {
                                                dispatch(getData(
                                                    'deleteResource',
                                                    {rId: rows.Id},
                                                    (res: any) => {
                                                        addTableVersion('ResourceTable')
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
                                    </>
                                )
                            },
                            width:"150px"
                        }
                    ]}
                />
            </div>
        </>
    );
}

export default ResourceProfile;