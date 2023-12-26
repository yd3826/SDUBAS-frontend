import DeleteConfirm, {Confirm} from "../../Component/Common/DeleteConfirm";
import {Button, message, Modal, Progress, Tag} from "antd";
import {useDispatch} from "../../Redux/Store";
import Template from "../../Component/Project/Template";
import {Api} from "../../API/api";
import {useNavigate} from "react-router-dom";
import React from "react";
import {convertTagstr} from "../../Utils/convertTagstr";

interface ApprovalProps {
    API: any;
}

export const ApprovalColumns = (props: ApprovalProps) => {
    const dispatch = useDispatch();
    const AddTableVersion = (name: string) => {
        dispatch({type: 'addTableVersion', name: name})
    }
    return (
        [
            {
                title: '申请人',
                key: 'who',
                dataIndex: 'who'
            },
            {
                title: '申请对象',
                key: 'what',
                dataIndex: 'what'
            },
            {
                title: '请求时间',
                key: 'when',
                dataIndex: "when"
            },
            {
                title: '操作',
                key: 'operator',
                render: (_: any, row: any) => {
                    return (
                        <>
                            <Confirm
                                title={"确认通过"}
                                content={<Button type={'link'}>通过</Button>}
                                onConfirm={() => {

                                }}
                            />
                            <Confirm
                                title={"确认拒绝"}
                                onConfirm={() => {
                                }}
                                content={<Button type={'link'} danger>拒绝</Button>}
                            />
                        </>
                    )
                }
            }
        ]
    )
}


export const PersonalProfileColumns = () => {
    const navigate = useNavigate();
    return [
        {
            title: '经历',
            children: [
                {
                    title: '经历名称',
                    key: 'proName',
                    dataIndex: 'name',
                    render: (name: string, item: any) => {
                        return <span
                            onClick={()=>{navigate(`/c/project-info/${item.id}`, {
                                state: {
                                    url: item.url,
                                    item: item,
                                    permissions:[],
                                }
                            });}}
                        >{name}</span>
                    }
                },
                {
                    title: '性质',
                    dataIndex: 'type',
                    key: 'type',
                    filters: [
                        {
                            text: '活动',
                            value: '活动'
                        },
                        {
                            text: '竞赛',
                            value: '竞赛'
                        }
                    ],
                    onFilter: (value: string, record: any) => record.type.indexOf(value) === 0,
                }
            ]
        },
        {
            title: '标签',
            key: 'tag',
            dataIndex:'tag',
            render: (tag: string) => {
                // console.log('tag', tag)
                const tags = convertTagstr(tag);
                return <Tag style={{fontSize: '12px'}}>{tags}</Tag>
            }
        }
    ]
}


export const CreditBankColumns = [
    {
        title: '学分类型',
        dataIndex: 'type',
        key: 'type'
    },
    {
        title: '学分要求',
        key: 'complete',
        render: (_: any, record: any) => {
            const progress = (record.completedCredits / record.requiredCredits) * 100;
            return (
                <div
                    style={{display: 'flex'}}
                >
                    <Progress
                        percent={progress}
                        size={'small'}
                        strokeColor="#1890ff" // 自定义进度条颜色
                        trailColor="#f5f5f5" // 自定义进度条背景颜色
                        showInfo={false}
                    />
                    <span
                        style={{fontSize: 'small'}}
                    >{`${record.completedCredits}/${record.requiredCredits}`}</span>
                </div>
            )
        },
        width: 200
    }
]

export const CreditBankChildColumns = [
    {
        title: '课程',
        dataIndex: 'project_name',
        key: 'course',
    },
    {
        title: '学分',
        dataIndex: 'credit',
        key: 'credit'
    },
    {
        title: "已修",
        dataIndex: 'is_pass',
        key: 'is_pass',
        render: (complete: any) => {
            if (complete)
                return <>已修</>
            else
                return <>未修</>
        },
        filters: [
            {
                text: '已修',
                value: true
            },
            {
                text: '未修',
                value: false
            }
        ],
        onFilter: (value: any, record: any) => record.is_pass.indexOf(value) === 0,
    }
]

export const TemplateColumns = (props: any) => [
    {
        title: '模板名称',
        dataIndex: 'role_name',
        key: 'name'
    },
    {
        title: '模板权限',
        dataIndex: 'privilege_list',
        key: 'permission',
        render: (list: any) => {
            let str = ''
            for (let i = 0; i < list.length; i++)
                if (i != list.length - 1)
                    str += list[i] + ','
                else str += list[i]
            return (<span>{str}</span>)
        }
    },
    {
        title: '操作',
        key: 'operator',
        render: (_: any, record: any) => {
            return (
                <>
                    {
                        record.status === -1 ? (
                            <Button
                                type={'link'}
                                onClick={() => {
                                    Api.applyTemplate({pId: props.pId, role_id: record.role_id})
                                        .then(() => {
                                            message.success('申请成功');
                                            props.addTableVersion('TemplateRolesTable');
                                        })
                                        .catch(() => {
                                        })
                                }}
                            >
                                申请
                            </Button>
                        ) : record.status === 1 ? (
                            <div style={{color: 'blue'}}>申请中</div>
                        ) : record.status === 0 ? <div style={{color: 'green'}}>通过</div> :
                            <div style={{color: 'red'}}>拒绝</div>
                    }
                </>
            )
        }
    }
]