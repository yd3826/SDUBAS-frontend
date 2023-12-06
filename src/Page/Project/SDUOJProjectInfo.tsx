import React, {useEffect, useState} from 'react';
import {Layout, Space, Tree, Image, Tag, Button, Menu, Dropdown, MenuProps, Divider} from 'antd';
import {DataNode} from 'antd/lib/tree';
import Title from "antd/es/typography/Title";
import {useLocation, useParams} from "react-router-dom";
import {tagOptions} from "../../Config/Project/data";
import {useSelector} from "react-redux";
import {IState} from "../../Type/base";
import {Api} from "../../API/api";
import {buildTree} from "../../Utils/buildTree";
import {DownOutlined} from "@ant-design/icons";
import {SubmissionList} from "../../Component/SDUOJ/SubmissionList/SubmissionList";
import {SDUSubmit} from "../../Component/SDUOJ/SDUSubmit";
import ReactMarkdown from "react-markdown";


const {Sider, Content} = Layout;


type IProjectContentType = "video" | "office_word" | "markdown" | "office_ppt"


interface keyIdMap {
    [key: string]: any;
}

const keyIdMap: keyIdMap = {}//key和id的字典
const IdConMap: keyIdMap = {}
const ProjectInfo: React.FC = () => {
    //contestId:pId,problemCode:cId
    const [selectedMenuKey, setSelectedMenuKey] = useState<number | null>(null);
    const [type, setType] = useState<IProjectContentType>("office_word")//原本的数据
    const [treeData, setTreeData] = useState<DataNode[] | undefined>(undefined);//树形数据
    const {pId} = useParams();
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
        Api.getOjContent({contestId: pId})
            .then(async (data: any) => {
                console.log('oj比赛内容',data);
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
    let manageitems: MenuProps['items'] = []
    if (selectedMenuKey && IdConMap[selectedMenuKey]) {
            items = [
                {
                    key: '2',
                    label: (
                        <SubmissionList contestId={pId} problemCode={IdConMap[selectedMenuKey].id}/>
                    )
                },
                {
                    key: '3',
                    label: <SDUSubmit contestId={pId} problemCode={IdConMap[selectedMenuKey].id} judgeTemplates={IdConMap[selectedMenuKey].judgeTemplates}/>,
                }
            ]
    }
    return (
        <div style={{minWidth: 600}}>
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
                            selectedMenuKey && IdConMap[selectedMenuKey] && item.type !== '教学资源' && (
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
                </Sider>
                <Layout style={{height:'100vh'}}>
                    <Content style={{padding: '24px'}}>
                        {
                            selectedMenuKey && IdConMap[selectedMenuKey] && (
                                <div style={{textAlign: "left"}}>
                                    <ReactMarkdown children={IdConMap[selectedMenuKey].content}/>
                                </div>
                            )
                            // <iframe
                            //     title="demo.docx"
                            //     src={"http://111.15.182.56:41018/api/files/download/f991f19000c9456e8027115de495b18d"}
                            //     width="100%"
                            //     height="100%"
                            // />
                        }
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
};
export default ProjectInfo;
