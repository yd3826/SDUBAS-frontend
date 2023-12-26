import {Button, Modal} from "antd";
import {useEffect, useState} from "react";
import TableWithPagination from "../../Common/Table/TableWithPagination";
import {Api} from "../../../API/api";
import moment from "moment";
import TestCase from "../TestCase";
import {StateList, SubmissionMap} from "../../../Type/submission";


const SubmissionInfo = (props: any) => {
    return (
        <TestCase
            type={"text"}
            caseType={StateList.indexOf(SubmissionMap[props.text])}
            append={
                props.text === "-2" ?
                    "(" + props.record.RunningStep + "/" + (props.record.checkpointNum + props.record.publicCheckpointNum) + ")"
                    : ""
            }
            record={props.record}
            contestId={props.contestId}
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
                    name={`SubmissionList${props.contestId}${props.problemCode}`}
                    API={async (data: any) => {
                        return Api.getSubmissionList({data: {...data, contestId: props.contestId,problemCode:props.problemCode,username:'sdubas_bind'}})
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
                                return (
                                    <>
                                        <span>SDUOJ</span> - <span>{text}</span>
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
                            dataIndex: 'judgeResult',
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
                            dataIndex: 'judgeScore',
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