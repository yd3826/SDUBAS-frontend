import React, {useEffect, useState} from "react";
import {Button, Card, Col, Divider, Image, message, Modal, Row, Tag} from "antd";
import Meta from "antd/es/card/Meta";
import ModalFormUseForm from "../Common/Form/ModalFormUseForm";
import {Api} from "../../API/api";
import getData from "../../API/getData";
import ProjectForm1 from "./Form/ProjectForm1";
import {useTranslation} from "react-i18next";
import DeleteConfirm from "../Common/DeleteConfirm";
import {useDispatch} from "../../Redux/Store";
import ProjectForm2 from "./Form/ProjectForm2";
import ModalRoleManage from "../../Page/School/Component/ModalRoleManage";
import {arraytostr} from "../../Utils/arraytostr";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {IState} from "../../Type/base";
import {convertTimestamp} from "../../Utils/convertTimestamp";
import {convertTagstr} from "../../Utils/convertTagstr";


export default function ProCard({item, TableName, pathname,oj}: any) {
    const [t] = useTranslation();
    const [isHovered, setIsHovered] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [permission,setPermission] = useState<any>([]);
    let tags = convertTagstr(item.tag);
    if(oj)tags='OJ'
    const AddTableVersion = (name: string) => {
        dispatch({type: 'addTableVersion', name: name});
    }
    // useEffect(()=>{
    //     Api.getUserPermission({data: {service_type: 7,service_id:item.id}})
    //         .then((res: any) => {
    //                 setPermission(res.map((e: any) => e.label))
    //             }
    //         )
    // },[])
    return (
        <Card
            style={{
                transform: isHovered ? 'translateY(-6px)' : 'none',
                transition: 'transform 0.2s ease', cursor: 'pointer',
            }}
        >
            <Row style={{minWidth: '1200px'}}>
                {
                    !oj && (
                        <Col span={2} style={{height: "80px"}}>
                            <Image
                                src={item.url}
                                alt="Item Image" style={{height: '80px'}} preview={false}/>
                        </Col>
                    )
                }
                <Col span={5}
                     onMouseEnter={() => setIsHovered(true)}
                     onMouseLeave={() => setIsHovered(false)}
                     onClick={() => {
                         if (item.active === 0) {
                             message.info('未开放');
                         } else {
                             if (oj) {
                                 navigate(`/c/sduoj/project-info/${item.id}`, {
                                     state: {
                                         url: item.url,
                                         item: item,
                                         permissions: permission
                                     }
                                 });
                             } else {
                                 navigate(`/c/project-info/${item.id}`, {
                                     state: {
                                         url: item.url,
                                         item: item,
                                         permissions: permission
                                     }
                                 });
                             }
                         }
                     }}
                >
                    <div style={{fontWeight: 'bold', textAlign: 'center', justifyContent: 'center'}}>{item.name}</div>
                    <div style={{display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '5px'}}>
                        <div style={{fontSize: '12px'}}>
                            {convertTimestamp(item.create_dt)}
                        </div>
                        <Tag style={{fontSize: '12px'}}>{tags}</Tag>
                    </div>
                </Col>
                <Col span={2}>
                    {
                        item.active === 0 && <Tag style={{color: 'red'}}>未开放</Tag>
                    }
                    {
                        item.active === 1 && <Tag style={{color: 'green'}}>进行中</Tag>
                    }
                    {
                        item.active === 2 && <Tag style={{color: 'yellow'}}>归档</Tag>
                    }
                </Col>
                <Col style={{display: 'flex', justifyContent: 'flex-start'}} span={4}>
                    {
                        !oj && (
                            <>
                                <ModalFormUseForm
                                    title={t('编辑项目')}
                                    type={'update'}
                                    TableName={TableName}
                                    btnName={'编辑'}
                                    width={1000}
                                    subForm={[
                                        {
                                            component: ProjectForm1({}),
                                            label: '',
                                        },
                                        {
                                            component: ProjectForm2({service_type: 7, pathname: pathname}),
                                            label: '',
                                        }
                                    ]}
                                    dataLoader={async () => {
                                        return Api.getProInfo({pId: item.id}).then((res: any) => {
                                            return res;
                                        })
                                    }}
                                    // initData={{img_id:{file_name:'what',url:"https://tse3-mm.cn.bing.net/th/id/OIP-C.dGSqeSYfrebW8r7baIn2BQAAAA?rs=1&pid=ImgDetMain"},type:'xx',contents:[{file_id:{file_name:'ww',url:'https://tse3-mm.cn.bing.net/th/id/OIP-C.dGSqeSYfrebW8r7baIn2BQAAAA?rs=1&pid=ImgDetMain'}}]}}
                                    dataSubmitter={(value: any) => {
                                        // console.log(value)
                                        value.tag = arraytostr(value.tag);
                                        return Api.updatePro({pId: item.id, data: value});
                                    }}
                                />

                                <ModalRoleManage editable={false} newRole={false} newUser={false} btnType={'link'}
                                                 TableName={`Project${item.id}Roles`} service_type={7}
                                                 service_id={item.id}/>
                                <DeleteConfirm
                                    onConfirm={() => {
                                        dispatch(getData(
                                            'deletePro',
                                            {pId: item.id},
                                            (res: any) => {
                                                AddTableVersion(TableName)
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
                    }
                </Col>
            </Row>
        </Card>
    )
}