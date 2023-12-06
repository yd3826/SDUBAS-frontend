import React, {useEffect, useState} from 'react';
import {Layout, Space, Tree, Image, Tag, Button, Menu, Dropdown, MenuProps, Divider} from 'antd';
import {DataNode} from 'antd/lib/tree';
import Title from "antd/es/typography/Title";
import ReactMarkdown from "react-markdown";
import {useLocation, useParams} from "react-router-dom";
import {tagOptions} from "../../Config/Project/data";
import ModalContentSubmit from "../../Component/Project/ModalContentSubmit";
import {useSelector} from "react-redux";
import {IState} from "../../Type/base";
import ModalFormUseForm from "../../Component/Common/Form/ModalFormUseForm";
import AddSubmissionForm from "../../Component/Project/Form/AddSubmissionForm";
import {Api} from "../../API/api";
import Score from "../../Component/Project/Score";
import {buildTree} from "../../Utils/buildTree";
import ApplyPermission from "../../Component/Permission/ApplyPermission";
import UserContentScore from "./Info/UserContentScore";
import PlayerWithDuration from "../../Component/Common/PlayerWithDuration";
import CreateTemplate from "../../Component/Project/CreateTemplate";
import {DownOutlined} from "@ant-design/icons";
import {CreditsRole} from "../../Component/Project/Credits";
import Approval from "../../Component/Permission/Approval";
import {DocumentEditor} from "@onlyoffice/document-editor-react";
import {WorkLog} from "../../Component/Common/WorkLog";


const {Sider, Content} = Layout;


type IProjectContentType = "video" | "office_word" | "markdown" | "office_ppt"


interface keyIdMap {
    [key: string]: any;
}

const keyIdMap: keyIdMap = {}//key和id的字典
const IdConMap: keyIdMap = {}
const ProjectInfo: React.FC = () => {
    const [selectedMenuKey, setSelectedMenuKey] = useState<number | null>(null);
    const [type, setType] = useState<IProjectContentType>("office_word")//原本的数据
    const [treeData, setTreeData] = useState<DataNode[] | undefined>(undefined);//树形数据
    const {pId} = useParams();
    const userinfo = useSelector((state: IState) => state.UserReducer.userInfo);
    const location = useLocation();
    const {item, permissions} = location.state;
    const generateTreeData = (data: any) => {//根据后端数据递归获得treeData
        return data.map((item: any) => {
            let {key, children, isLeaf} = item;
            keyIdMap[key] = item;

            //如果存在孩子则递归
            if (!isLeaf && children) {
                generateTreeData(children);
            }
        });
    };
    const handleMenuSelect = async (selectedKeys: React.Key[], {node}: any) => {
        setSelectedMenuKey(node.key);
    };
    useEffect(() => {
        Api.getProContent({pId: pId})
            .then(async (data: any) => {
                // console.log(data)
                data.map((d: any) => {
                    const {id} = d;
                    IdConMap[id] = d;
                })
                setSelectedMenuKey(data[0].id);
                // console.log(IdConMap);
                const Tree = buildTree(data);
                setTreeData(() => {
                    return [...Tree]
                });
            })
            .catch(() => {
            })
    }, [])
    useEffect(() => {
        if (treeData)
            generateTreeData(treeData);
    }, [treeData])
    let items: MenuProps['items'] = []
    let manageitems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <ApplyPermission service_type={7} service_id={item.id}/>
            )
        },
        {
            key: '2',
            label: (
                <CreateTemplate service_type={7} service_id={item.id}/>
            )
        },
        {
            key: '10',
            label: (
                <Approval pId={pId} service_type={7}/>
            )
        },
        {
            key:'11',
            label:(
                <WorkLog service_type={7} service_id={pId} btnType={'text'}/>
            )
        }
    ]
    if (item.type !== '教学资源' || item.type !== '实验' ) {
        // if (permissions.some((e: any) => e === '项目学分认定'))
            manageitems.push({
                key: '3', label: (
                    <CreditsRole pId={pId}/>
                )
            })
    }
    if (selectedMenuKey && IdConMap[selectedMenuKey]) {
        // if (permissions.some((e: any) => e === '项目提交'))
            items = [
                {
                    key: '1',
                    label: (
                        <UserContentScore pId={pId}/>
                    )
                },
                {
                    key: '2',
                    label: (
                        <ModalContentSubmit
                            pId={pId} // @ts-ignore
                            cId={IdConMap[selectedMenuKey].id}
                            username={userinfo?.username}//这里可能会替换成userid
                        />
                    )
                },
                {
                    key: '4',
                    label: (
                        <Button type={'ghost'} onClick={() => {
                            // @ts-ignore
                            Api.getRefresh({pId: pId, cId: IdConMap[selectedMenuKey].id}).catch(()=>{})
                        }}>更新我的</Button>
                    )
                }
            ]
        // if (permissions.some((e: any) => e === '项目批阅'))
            items.push(
                {
                    key: '3',
                    label: (
                        // @ts-ignore
                        <Score pId={pId} cId={IdConMap[selectedMenuKey].id}/>
                    )
                }
            )
        if (item.type !== '教学资源') {
            // if (permissions.some((e: any) => e === '项目批阅')) {
                manageitems.push({
                    key: '', label: (
                        <ModalFormUseForm
                            title={'添加提交任务'}
                            btnName={'添加提交'}
                            btnType={'text'}
                            TableName={`SubmitContentTable`}
                            subForm={[
                                {
                                    component: () => AddSubmissionForm({cId: keyIdMap[selectedMenuKey].key}),
                                    label: '',
                                }
                            ]}
                            dataSubmitter={async (data: any) => {
                                // console.log('data',data);
                                return Api.submitProContent({
                                    pId: pId,
                                    cId: keyIdMap[selectedMenuKey].key,
                                    data: data
                                })
                            }}
                        />)
                })
                manageitems.push({
                    key: '5', label: (<Button type={'text'} onClick={() => {
                        Api.getRefreshAll({pId: pId, cId: keyIdMap[selectedMenuKey].key})
                    }}>更新全部</Button>)
                })
            // }
        }
    }
    return (
        <div style={{minWidth: 800}}>
            <div style={{textAlign: "left", marginBottom: 12, marginLeft: 6}}>
                <Space size={24}>
                    <Image
                        preview={false}
                        width={80}
                        height={45}
                        src={item.url}
                        alt={item.name}
                    />
                    <Space direction="vertical" size={0}>
                        <Space>
                            <Title level={4} style={{margin: 0}}>{item.name}</Title>
                            {
                                item.tag.split(',').map((t: string) => {
                                    for (const tag of tagOptions)
                                        if (tag.key === t)
                                            return (<Tag color="#CBA265">{tag.value}</Tag>)
                                })
                            }
                        </Space>
                    </Space>
                </Space>
                <div style={{float: "right", marginRight: 6}}>
                    <Space size={12}>
                        {/*还有一些待传的参数*/}
                        {
                            selectedMenuKey &&IdConMap[selectedMenuKey] && item.type !== '教学资源' && (
                                <>
                                    <Dropdown
                                        menu={{items}}
                                    >
                                        <Button type="text" size={"large"}>
                                            <Space>
                                                <div style={{marginTop: -10}}>
                                                    菜单
                                                </div>
                                                <DownOutlined style={{fontSize: 10, marginBottom: 20}}/>
                                            </Space>
                                        </Button>
                                    </Dropdown>
                                </>
                            )
                        }
                    </Space>
                </div>
            </div>
            <Layout style={{minHeight: 600}}>
                <Sider width={250} style={{background: '#f0f2f5'}}>
                    {
                        treeData !== undefined && <Tree
                            showLine
                            autoExpandParent={true}
                            switcherIcon={<DownOutlined/>}
                            defaultExpandedKeys={selectedMenuKey ? [selectedMenuKey] : []}
                            onSelect={handleMenuSelect}
                            // selectedKeys={selectedMenuKey !== null ? [selectedMenuKey] : []}
                            treeData={treeData}
                            style={{background: '#f0f2f5', paddingTop: 8, paddingLeft: 4, paddingBottom: 8}}
                        />
                    }

                    <div style={{left: '0%', width: '100px'}}>
                        <Dropdown
                            menu={{items: manageitems}}
                        >
                            <Button type="text" size={"large"}>
                                <Space>
                                    <div style={{marginTop: -10}}>
                                        管理项目
                                    </div>
                                    <DownOutlined style={{fontSize: 10, marginBottom: 20}}/>
                                </Space>
                            </Button>
                        </Dropdown>
                    </div>
                </Sider>
                <Layout>
                    <Content style={{padding: '24px'}}>
                        {
                            selectedMenuKey && IdConMap[selectedMenuKey] ?
                                <ContentPlay pId={pId}
                                             file={{
                                                 file_type: IdConMap[selectedMenuKey].file_type,
                                                 file_name: IdConMap[selectedMenuKey].file_id?.file_name,
                                                 url: IdConMap[selectedMenuKey].file_id?.url
                                             }}
                                             content={IdConMap[selectedMenuKey].content}
                                             cId={selectedMenuKey}/>
                                : (
                                    <>您正在查看目录页</>
                                )
                        }
                    </Content>
                </Layout>
            </Layout>
        </div>
    )
        ;
};

const ContentPlay = (props: any) => {
    const {file, content} = props;
    return (
        <>
            {
                file.file_type === "video" && (
                    <PlayerWithDuration
                        url={file.url}
                        pId={props.pId}
                        cId={props.cId}
                    />
                )
            }
            {
                (file.file_type === "office_word") && (
                    <DocumentEditor id={"docxEditor"} documentServerUrl={'http://43.138.34.119:8000'}
                                    config={{
                                        "document": {
                                            "fileType": "docx",
                                            "key": file.file_name,
                                            "title": file.file_name,
                                            "url": file.url,
                                            permissions: {
                                                edit: false, // 禁用编辑权限
                                                download: true, // 启用下载权限
                                                chat: false
                                            },
                                        },
                                        "documentType": 'word',
                                    }}
                                    height={'80vh'}
                                    width={'100%'}
                    />
                    // <iframe
                    //     title="demo.docx"
                    //     src={"https://view.xdocin.com/view?src=" + props.url}
                    //     width="100%"
                    //     height="720px"
                    // />
                )
            }
            {
                file.file_type === "office_ppt" && (
                    <DocumentEditor id={"docxEditor"} documentServerUrl={'http://43.138.34.119:8000'}
                                    config={{
                                        "document": {
                                            "fileType": "ppt",
                                            "key": file.file_name,
                                            "title": file.file_name,
                                            "url": file.url,
                                            permissions: {
                                                edit: false, // 禁用编辑权限
                                                download: true, // 启用下载权限
                                                chat: false
                                            },
                                        },
                                        "documentType": 'slide',
                                    }}
                                    height={'80vh'}
                                    width={'100%'}
                    />
                )
            }
            {
                file.file_type === 'application/pdf' && (
                    <iframe
                        title="demo.docx"
                        src={file.url}
                        width="100%"
                        height="80vh"
                    />
                )
            }
            {
                file.file_type === 'zip' && (
                    <>
                        <div style={{ display: "table", width: "200px", textAlign: "left", margin: "20px",height:'80vh'}}>
                            <div style={{ display: "table-row" }}>
                                <div style={{ display: "table-cell", padding: "10px", border: "1px solid #ccc" }}>
                                    {file.file_name}
                                </div>
                                <div style={{ display: "table-cell", padding: "10px", border: "1px solid #ccc"}}>
                                    <Button type={'link'} onClick={()=>{window.open(file.url)}}>下载</Button>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
            {
                content && (
                    <div style={{textAlign: "left"}}>
                        <ReactMarkdown children={props.content}/>
                    </div>
                )
            }
        </>
    )
}
export default ProjectInfo;
