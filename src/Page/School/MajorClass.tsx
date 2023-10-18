import {useLocation} from "react-router-dom";
import {Button, Card, Col, Image, List, message, Modal, Row, Space} from "antd";
import TableWithPagination from "../../Component/Common/Table/TableWithPagination";
import {Api} from "../../API/api";
import ModalFormUseForm from "../../Component/Common/Form/ModalFormUseForm";
import DeleteConfirm from "../../Component/Common/DeleteConfirm";
import getData from "../../API/getData";
import React, {useState} from "react";
import {useDispatch} from "../../Redux/Store";
import {ClassForm, CollegeForm, MajorForm} from "../../Component/User/Form/SchoolForms";
import Title from "antd/es/typography/Title";
import RoleManageForm from "../../Component/Permission/Form/RoleManageForm";
import {AssignmentForm} from "../../Component/Permission/Form/Assignment";
import ModalRoleManage from "./Component/ModalRoleManage";
import BatchImport from "../../Component/Common/BatchImport";

const MajorClass = () => {
    const [visible, setVisible] = useState(false);
    const location = useLocation();
    const {school, college} = location.state;
    const dispatch = useDispatch();
    const AddTableVersion = (name: string) => {
        dispatch({type: 'addTableVersion', name: name})
    }
    return (
        <>
            <Image src={college.image} alt={'学校图片'}/>
            <Title level={2}>{college.name}</Title>
            <div style={{marginLeft: 1200, marginBottom: 20}}>
                <ModalRoleManage newRole={true} TableName={'CollegeRolesTable' + college.college_id}/>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
            }}>
                <Card
                    style={{width: 800}}
                    title={'专业'}
                    extra={
                        (
                            <Space>
                                <ModalFormUseForm
                                    title={'添加专业'}
                                    TableName={college.id + 'MajorTable'}
                                    type={'create'}
                                    btnName={'添加专业'}
                                    subForm={[
                                        {
                                            component: () => MajorForm({college_id: college.id, create: 1}),
                                            label: '',
                                        }
                                    ]}
                                    initData={{school_id: school.id, college_id: college.id}}
                                    dataSubmitter={async (data: any) => {
                                        console.log(data)
                                        return Api.newMajor({data: data})
                                    }}
                                />
                            </Space>
                        )
                    }
                >
                    <TableWithPagination
                        name={college.id + 'MajorTable'}
                        useList={true}
                        API={async (data: any) => {
                            return Api.getMajor({data: {college_id: college.id, ...data}})
                        }}
                        renderItem={(item: any) => {
                            return (
                                <List.Item>
                                    <Row>
                                        <Col>
                                            <Image src={item.image} alt={'专业'}/>
                                        </Col>
                                        <Col flex={'auto'}>
                                            <span>{item.name}</span>
                                        </Col>
                                        <Col>
                                            <ModalFormUseForm
                                                title={'编辑专业'}
                                                TableName={college.id + 'MajorTable'}
                                                type={'update'}
                                                btnName={'编辑'}
                                                subForm={[
                                                    {
                                                        component: () => MajorForm({college_id: college.id}),
                                                        label: ''
                                                    }
                                                ]}
                                                // dataLoader={async ()=>{return }}
                                                initData={item}
                                                dataSubmitter={async (data: any) => {
                                                    return Api.updateMajor({mId: item.id, data: data})
                                                }}
                                            />
                                        </Col>
                                        <Col>
                                            <ModalRoleManage
                                                newRole={true} btnType={'link'}
                                                TableName={'MajorRolesTable' + college.college_id}
                                                service_type={3} service_id={item.id}
                                            />
                                        </Col>
                                        <Col>
                                            <BatchImport item={false} btnName={'上传方案'} btnType={'link'}
                                                         API={async (data: any) => {
                                                             return Api.newLine({data: data})
                                                         }}/>
                                            {/*<DeleteConfirm*/}
                                            {/*    onConfirm={() => {*/}
                                            {/*        dispatch(getData(*/}
                                            {/*            'deleteMajor',*/}
                                            {/*            {mId: item.id},*/}
                                            {/*            (res: any) => {*/}
                                            {/*                AddTableVersion(college.id + 'ClassTable')*/}
                                            {/*                message.success('删除成功')*/}
                                            {/*                return Promise.resolve(res);*/}
                                            {/*            },*/}
                                            {/*            (error: any) => {*/}
                                            {/*                message.error('删除失败');*/}
                                            {/*            }*/}
                                            {/*        ));*/}
                                            {/*    }}//删除的Api*/}
                                            {/*    content={*/}
                                            {/*        <Button type={'link'} danger={true}>删除</Button>*/}
                                            {/*    }*/}
                                            {/*/>*/}
                                        </Col>
                                    </Row>


                                </List.Item>
                            )
                        }}
                    />
                </Card>
                <Card
                    style={{width: 800}}
                    title={'班级'}
                    extra={(
                        <Space>
                            <ModalFormUseForm
                                title={'添加班级'}
                                TableName={college.id + 'ClassTable'}
                                type={'create'}
                                btnName={'添加班级'}
                                subForm={[
                                    {
                                        component: () => ClassForm({college_id: college.id}),
                                        label: ''
                                    }
                                ]}
                                initData={{school_id: school.id, college_id: college.id}}
                                dataSubmitter={async (data: any) => {
                                    return Api.newClass({data: data})
                                }}
                            />
                        </Space>
                    )}
                >
                    <TableWithPagination
                        name={college.id + 'ClassTable'}
                        API={async (data: any) => {
                            return Api.getClass({data: {college_id: college.id, ...data}})
                        }}
                        useList={true}
                        renderItem={(item: any) => {
                            return (
                                <List.Item>
                                    <Row>
                                        <Col>
                                            <Image src={item.image} alt={'班级'}/>
                                        </Col>
                                        <Col flex="auto">
                                            <span>{item.name}</span>
                                        </Col>
                                        <Col>
                                            <ModalFormUseForm
                                                title={'编辑班级'}
                                                TableName={college.id + 'ClassTable'}
                                                type={'update'}
                                                btnName={'编辑'}
                                                subForm={[
                                                    {
                                                        component: () => ClassForm({college_id: college.id}),
                                                        label: '',
                                                    },
                                                ]}
                                                // dataLoader={async ()=>{return }}
                                                initData={item}
                                                dataSubmitter={async (data: any) => {
                                                    return Api.updateClass({cId: item.id, data: data});
                                                }}
                                            />
                                        </Col>
                                        <Col>
                                            <ModalRoleManage
                                                newRole={true}
                                                editable={true}
                                                btnType={'link'}
                                                TableName={'ClassRolesTable' + college.college_id}/>
                                        </Col>
                                        <Col>
                                            <DeleteConfirm
                                                onConfirm={() => {
                                                    dispatch(
                                                        getData(
                                                            'deleteClass',
                                                            {cId: item.id},
                                                            (res: any) => {
                                                                AddTableVersion(college.id + 'ClassTable');
                                                                message.success('删除成功');
                                                                return Promise.resolve(res);
                                                            },
                                                            (error: any) => {
                                                                message.error('删除失败');
                                                            }
                                                        )
                                                    );
                                                }} //删除的Api
                                                content={<Button type={'link'} danger={true}>删除</Button>}
                                            />
                                        </Col>
                                    </Row>
                                </List.Item>
                            )
                        }}
                    />
                </Card>
            </div>
        </>
    )
}

export default MajorClass;