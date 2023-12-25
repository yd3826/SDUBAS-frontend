    import TableWithPagination from "../Common/Table/TableWithPagination";
import {Api} from "../../API/api";
import {Button, Card, Form, Input, message, Modal, Select, Space, Table} from "antd";
import {useEffect, useState} from "react";
import {useDispatch} from "../../Redux/Store";
import {CreditBankChildColumns, CreditBankColumns} from "../../Config/Resource/columns";
import {useSelector} from "react-redux";
import {IState} from "../../Type/base";


const CreditBank = () => {
    const userinfo = useSelector((state: IState) => state.UserReducer)
    const [credits, setCredits] = useState<any>(0);
    const [User, setUser] = useState<any>({user_name:userinfo.userInfo?.username});
    const dispatch = useDispatch();
    const AddTableVersion = (name: string) => {
        dispatch({type: 'addTableVersion', name: name})
    }
    //自动得到学生的总学分
    // useEffect(() => {
    //     if(User)
    //     {
    //         Api.getUserCredits({data: {user_id: User.user_id}}).then((res: any) => {
    //             setCredits(res.credit);
    //         }).catch(() => {
    //             // message.error('刷新重试')
    //         })
    //         AddTableVersion('StudentCreditTable');
    //     }
    // }, [User]);
    return (
        <div
            className={"table-container"}
        >
            <Card
                title={'学分银行'}
                headStyle={{textAlign:'left'}}
                style={{minWidth:'1000px'}}
                extra={
                <>
                    <SelectUser setRecord={(User:any)=>{setUser(User)}}/>
                    <span
                        style={{
                            backgroundColor: 'rgba(128, 128, 128, 0.1)',
                            padding: '5px 10px',
                            borderRadius: '4px',
                        }}
                    >
                        {User.user_name === undefined ? (userinfo.userInfo?.username===undefined?`未登录` : `${userinfo.userInfo.username} 已修学分:${credits}`):`${User.user_name} 已修学分:${credits}`}
                    </span>
                </>
            }>
                <TableWithPagination
                    API={async (data: any) => {
                        return Api.getRequirements({data: data})
                    }}
                    columns={CreditBankColumns}
                    expandedRowRender={(record: any) => ChildTable(record,User)}
                    APIRowsTransForm={(rows: any) => {
                        let tot = 0;
                        for (let i = 0; i < rows.length; i++) {
                            tot += rows[i].completedCredits
                            rows[i] = {key:`${i}`,...rows[i]}
                        }
                        setCredits(tot);
                        return rows
                    }}
                />
            </Card>
        </div>
    )
}


export const SelectUser = (props: any) => {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <Modal
                open={visible}
                onCancel={() => {
                    setVisible(false)
                }}
                title={'选择查看'}
                footer={null}
                width={'800px'}
            >
                <TableWithPagination
                    API={async (data: any) => {
                        return Api.getCreatedUsers({data: data})
                    }}
                    getForm={(onFinish: any) => {
                        return (
                            <Space size={30}>
                                <Form.Item label={"用户名"} name={"user_name"}>
                                    <Input onPressEnter={() => {
                                        onFinish();
                                    }}/>
                                </Form.Item>
                            </Space>
                        );
                    }}
                    useFormBtn={false}
                    columns={[
                        {
                            title: '学号/工号',
                            dataIndex: 'card_id',
                            key: 'card_id'
                        },
                        {
                            title: '姓名',
                            dataIndex: 'real_name',
                            key: 'real_name'
                        },
                        {
                            title: '用户名',
                            dataIndex: 'user_name',
                            key: 'username'
                        },
                        {
                            title: '学校',
                            dataIndex: 'school',
                            key: 'school'
                        },
                        {
                            title: '专业',
                            dataIndex: 'major',
                            key: 'major'
                        },
                        {
                            title: '班级',
                            dataIndex: 'class',
                            key: 'class'
                        },
                        {
                            title: '操作',
                            key: 'operator',
                            render: (_: any, record: any) => {
                                // console.log(record);
                                return (
                                    <Button type={'default'} onClick={() => {
                                        props.setRecord(record);
                                        setVisible(false)
                                    }}>选择</Button>
                                )
                            }
                        },
                        {

                        }
                    ]}
                />
            </Modal>
            <Button type={'primary'} onClick={() => setVisible(true)}>选择</Button>
        </>
    );
}

export default CreditBank;


const ChildTable = (record: any,user:any) => {
    return (
        <TableWithPagination
            API={async (data:any) => {
                if(user !== undefined)
                {
                    data['user_id'] = user.uesr_id
                }
                return Api.getCourseByCredit({type:record.type,data:{...data}})
            }}
            columns={CreditBankChildColumns}
        />
    )
}