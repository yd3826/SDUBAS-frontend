import {Button, Modal} from "antd";
import {useEffect, useState} from "react";
import TableWithPagination from "../../Common/Table/TableWithPagination";
import {Api} from "../../../API/api";
import moment from "moment";
import TestCase from "../TestCase";
import {StateList, SubmissionMap} from "../../../Type/submission";


const SubmissionInfo = (props: any) => {
    const [code,setCode] = useState('');
    useEffect(() => {
        Api.getSubmissionInfo({data:{submissionId:props.record.submissionId,contestId:props.contestId}})
            .then((res:any)=>{
                console.log('提交详情',res);
                setCode(res.code);
            }).catch(()=>{})
    }, [])
    return (
        <TestCase
            type={"text"}
            caseType={StateList.indexOf(SubmissionMap[props.text])}
            append={
                props.text === "-2" ?
                    "(" + props.record.RunningStep + "/" + (props.record.checkpointNum + props.record.publicCheckpointNum) + ")"
                    : ""
            }
            submitcode={code}
        />
    )
}
export const SubmissionList = (props: any) => {
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    return (
        <>
            <Button onClick={() => {
                setVisible(true)
            }} type={'text'}>提交记录</Button>
            <Modal
                title={'提交记录'}
                onCancel={() => {
                    setVisible(false)
                }}
                footer={null}
                open={visible}
                width={'1200px'}
            >
                <TableWithPagination
                    name={'SubmissionList'}
                    API={async (data: any) => {
                        return Api.getSubmissionList({data: {...data, contestId: props.contestId}})
                    }}
                    columns={[
                        {
                            title: "ID",
                            dataIndex: "submissionId",
                            key: "submissionId",
                        },
                        {
                            title: "用户名",
                            dataIndex: "username",
                            key: "username"
                        },
                        {
                            title: "题目编号",
                            dataIndex: "problemCode",
                            key: "problemCode",
                            render: (text: any) => {
                                let ps = text.split("-")
                                return (
                                    <>
                                        <span>{ps[0]}</span> - <span>{ps[1]}</span>
                                    </>
                                )
                            }
                        },
                        {
                            title: "题目名",
                            dataIndex: "problemTitle",
                            key: "problemTitle"
                        },
                        {
                            title: '结果',
                            dataIndex: 'result',
                            key: 'result',
                            render: (text: any, record: any) => {
                                return (
                                    <SubmissionInfo record={record} text={text} contestId={props.contestId}/>
                                    // <TestCase
                                    //     type={"text"}
                                    //     caseType={StateList.indexOf(SubmissionMap[text])}
                                    //     append={
                                    //         text === "-2" ?
                                    //             "(" + record.RunningStep + "/" + (record.checkpointNum + record.publicCheckpointNum) + ")"
                                    //             : ""
                                    //     }
                                    //     submitcode={record.code}
                                    // />
                                )
                            }
                        },
                        {
                            title: '得分',
                            dataIndex: 'score',
                            key: 'score',
                            render: (text: number, record: any) => {
                                if (record.sumScore === undefined)
                                    return text
                                return Math.floor(text / record.sumScore * 100) + "%"
                            }
                        },
                        {
                            title: "提交时间",
                            dataIndex: "gmtCreate",
                            key: "submitTime",
                            render: (text: any) => {
                                return moment(Number(text)).fromNow();
                            }
                        },
                    ]}
                />
            </Modal>
        </>
    )
}