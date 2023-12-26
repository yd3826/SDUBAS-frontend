import {Button, Modal} from "antd";
import TableWithPagination from "../Common/Table/TableWithPagination";
import {useState} from "react";
import {Api} from "../../API/api";
import SubmissionSForm from "./Form/SubmissionSForm";
import TextArea from "antd/es/input/TextArea";
import ReactMarkdown from "react-markdown";

const ModalContentSubmit = (props: any) => {
    const [visible, setVisible] = useState(false);
    const columns = [
            {
                title: "名称",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "提交类型",
                dataIndex: "type",
                key: "type",
                render: (type: any) => (type === 0 ? <span>文本</span> : <span>文件</span>)
            },
            {
                title: "提交",
                key: "submit",
                render: (_: any, rows: any) => {
                    return (<SubmissionSForm pId={props.pId} cId={props.cId} rows={rows}/>//如果需要，可以重新提交
                    )
                }
            },
            {
                title: '查看',
                render: (_: any, record: any) => {
                    if (record.commit === 0) return <>未提交</>
                    if (record.type === 1) return (<Button type={'link'} onClick={() => {
                            window.open(record.url)
                        }}>下载</Button>
                    )
                    else
                        return (
                            <>
                                <Modal
                                    open={visible}
                                    onCancel={() => {
                                        setVisible(false)
                                    }}
                                    width={'1000px'}
                                    // bodyStyle={{height:'500px'}}
                                >
                                    <div style={{display: 'flex', flexDirection: 'row', gap: '20px'}}>
                                        <div>
                                            <div style={{marginBottom: '10px', fontSize: '15px'}}>文本显示:</div>
                                            <TextArea
                                                title={'文本'}
                                                disabled={true}
                                                value={record.content}
                                                style={{height: '400px', width: '400px'}}
                                                showCount
                                            />
                                        </div>
                                        <div>
                                            <div style={{marginBottom: '10px', fontSize: '15px'}}>MarkDown实时渲染:</div>
                                            <div style={{height: '400px', width: '400px',overflow:'auto'}}>
                                                <ReactMarkdown
                                                    children={record.content}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </Modal>
                                <Button type={'link'} onClick={() => {
                                    setVisible(true)
                                }}>查看</Button>
                            </>
                        )
                }
            }
        ]
    ;
    const [modalVisible, setModalVisible] = useState(false);

    const handleViewSubmission = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };
    // useEffect(() => {
    // }, [props.cId])
// console.log('contentId',props.cId);
    return (
        <div>
            <Button onClick={handleViewSubmission} type={'ghost'}>提交</Button>
            <Modal
                title="提交记录"
                open={modalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={'600px'}
            >
                <TableWithPagination
                    name={`SubmitContentTable${props.cId}`}
                    API={async (data: any) => {
                        return Api.getPCSubmission({
                            pId: props.pId,
                            data: {
                                // userId: props.userId ?? "1",
                                contentId: props.cId,
                                ...data
                            }
                        })
                    }}
                    columns={columns}

                />
            </Modal>
        </div>
    );
}

export default ModalContentSubmit;