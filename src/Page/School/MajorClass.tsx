import {useLocation} from "react-router-dom";
import {Button, Card, Col, Image, List, message, Modal, Row, Space} from "antd";
import TableWithPagination from "../../Component/Common/Table/TableWithPagination";
import {Api} from "../../API/api";
import ModalFormUseForm from "../../Component/Common/Form/ModalFormUseForm";
import DeleteConfirm from "../../Component/Common/DeleteConfirm";
import getData from "../../API/getData";
import React, {useState} from "react";
import {useDispatch} from "../../Redux/Store";
import {ClassForm, MajorForm} from "../../Component/User/Form/SchoolForms";
import Title from "antd/es/typography/Title";
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
            <div style={{minWidth: '1500px'}}>
                <Image src={college.image} alt={'学院图片'} style={{width: 'auto', height: '200px'}}/>
                <Title level={2}>{college.name}</Title>
            </div>
            {/*<div style={{marginLeft: 1200, marginBottom: 20}}>*/}
            {/*    <ModalRoleManage newRole={true} TableName={'CollegeRolesTable' + college.college_id}/>*/}
            {/*</div>*/}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                minWidth: '1500px'
            }}>
                <Card
                    style={{minWidth: "700px"}}
                    title={'专业'}
                    headStyle={{textAlign: 'left'}}
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
                                            component: () => MajorForm({college_id: college.id, create: 1,required:true}),
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
                                                        component: () => MajorForm({college_id: college.id,create:0,school_id:school.id,major_id:item.id}),
                                                        label: ''
                                                    }
                                                ]}
                                                // dataLoader={async ()=>{return }}
                                                initData={item}
                                                dataSubmitter={async (data: any) => {
                                                    console.log(data)
                                                    return Api.updateMajor({mId: item.id, data: data})
                                                }}
                                            />
                                        </Col>
                                        <Col>
                                            <ModalRoleManage
                                                newRole={true} btnType={'link'}
                                                TableName={'MajorRolesTable' + college.college_id}
                                                service_type={3} service_id={item.id}
                                                API={async (data:any)=>{return Api.addMajorRole({data:data})}}
                                            />
                                        </Col>
                                        <Col>
                                            <BatchImport item={false} btnName={'上传方案'} btnType={'link'}
                                                         API={async (data: any) => {
                                                             return Api.newLine({data: data})
                                                         }}/>
                                            <DeleteConfirm
                                                onConfirm={() => {
                                                    dispatch(getData(
                                                        'deleteMajor',
                                                        {mId: item.id},
                                                        (res: any) => {
                                                            AddTableVersion(college.id + 'ClassTable')
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
                                        </Col>
                                    </Row>


                                </List.Item>
                            )
                        }}
                    />
                </Card>
                <Card
                    style={{minWidth: "700px"}}
                    title={'班级'}
                    headStyle={{textAlign: 'left'}}
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
                                                TableName={'ClassRolesTable' + college.college_id}
                                                service_type={3} service_id={item.id}
                                                API={async (data:any)=>{return Api.addClassRole({data:data})}}
                                            />
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