import React, {useContext, useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {IState} from "../../Type/base";
import {Api} from "../../API/api";
import {Card, Descriptions, Form} from "antd";
import "../../Config/CSS/PersonalProfile.css";
import {SelectUser} from "./CreditBank";
import TableWithPagination from "../Common/Table/TableWithPagination";
import {PersonalProfileColumns} from "../../Config/Resource/columns";
import {useDispatch} from "../../Redux/Store";
import ModalFormUseForm from "../Common/Form/ModalFormUseForm";
import ProjectForm1 from "../Project/Form/ProjectForm1";
import ProjectForm2 from "../Project/Form/ProjectForm2";
import {arraytostr} from "../../Utils/arraytostr";
import ItemName from "../Common/Form/Item/ItemName";
import ItemType from "../Common/Form/Item/ItemType";
import {ProOptions, tagOptions} from "../../Config/Project/data"; // 引入 CSS 样式文件
const PersonalProfile = () => {
    const userinfo = useSelector((state: IState) => state.UserReducer)
    const [record, setRecord] = useState<any>({user_name: userinfo.userInfo?.username});
    const dispatch = useDispatch()
    // console.log(userinfo)
    const AddTableVersion = (name: string) => {
        dispatch({type: 'addTableVersion', name: name})
    }
    useEffect(() => {
        AddTableVersion('PersonalTable')
    }, [record])
    return (
        <div
            className={"table-container"}
        >
            <Card
                title={'个人档案'}
                headStyle={{textAlign: 'left'}}
                style={{minWidth: '1000px'}}
                extra={
                    <div>
                        <div style={{display:'flex'}}>
                        <ModalFormUseForm
                            title={'导入档案'}
                            btnType={'default'}
                            btnName={'导入'}
                            TableName={`PersonProfile${record.user_id}Table`}
                            subForm={[
                                {
                                    component: ProjectForm1({typeAble:true,typeOp:[{
                                            key:'竞赛',
                                            value:'竞赛',
                                        },
                                            {
                                                key:'活动',
                                                value:'活动'
                                            }]}),
                                    label: "",
                                },
                                {
                                    component: ProjectForm2({service_type: 7}),
                                    label: ""
                                }
                            ]}
                            dataSubmitter={(value: any) => {
                                // console.log('up', value);
                                value.tag = arraytostr(value.tag);
                                value.contents.forEach((e: any) => {
                                    e.feature = JSON.stringify(e.feature);
                                })
                                return Api.newPro({
                                    data: value
                                });
                            }}
                        />
                        <SelectUser setRecord={setRecord}/>
                        </div>
                        <span
                            style={{
                                backgroundColor: 'rgba(128, 128, 128, 0.1)',
                                padding: '5px 10px',
                                borderRadius: '4px',
                            }}
                        >
                        {record?.user_name === undefined ? (userinfo.userInfo?.username === undefined ? '未登录' : `当前用户为${userinfo.userInfo?.username}`) : `当前用户为:${record?.user_name}`}
                </span>
                    </div>
                }>
                {/*<Descriptions*/}
                {/*    title={"用户信息"}*/}
                {/*>*/}
                {/*    <Descriptions.Item label={'姓名'}>{record?.user_name}</Descriptions.Item>*/}
                {/*    <Descriptions.Item label={'入学时间'}>{record?.enrollment_dt}</Descriptions.Item>*/}
                {/*    <Descriptions.Item label={'毕业时间'}>{record?.graduation_dt}</Descriptions.Item>*/}
                {/*    <Descriptions.Item label={'学号'}>{record?.card_id}</Descriptions.Item>*/}
                {/*</Descriptions>*/}
                <TableWithPagination
                    name={`PersonProfile${record.user_id}Table`}
                    columns={PersonalProfileColumns()}
                    API={async (data: any) => {
                        // console.log(record)
                        if (record?.user_id) {
                            data = {user_id: record.user_id, ...data}
                        }
                        return Api.getPersonalProfile({data: {...data}})
                    }}
                    bordered
                />

                {/*<TableWithPagination*/}
                {/*    */}
                {/*/>*/}
            </Card>
        </div>
    )
};

export default PersonalProfile;

