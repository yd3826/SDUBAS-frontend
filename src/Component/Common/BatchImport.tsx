import {Button, message, Modal, Upload} from "antd";
import {useState} from "react";
import {read, utils, writeFileXLSX} from 'xlsx';
import {InboxOutlined} from "@ant-design/icons";
import {Api} from "../../API/api";
import moment from "moment";
import {useDispatch} from "../../Redux/Store";
import {sha256} from "js-sha256";

const {Dragger} = Upload;
const BatchImport = (props: any) => {
    const [visible, setVisible] = useState(false);
    const {value, onChange} = props
    const dispatch = useDispatch();
    const AddTableVersion = (name: string) => {
        dispatch({type: 'addTableVersion', name: name})
    }
    const handleUpload = (file: any) => {

        let reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = (e) => {
            let workbook = read(e.target?.result);
            let sheet = workbook.Sheets[workbook.SheetNames[0]];
            let arr = utils.sheet_to_json(sheet, {defval: ''});
            let newArr = arr.map((item: any) => {
                delete item.__EMPTY
                if (item.入学时间) {
                    item.入学时间 = moment(new Date((item.入学时间 - 25569) * 86400 * 1000)).format('YYYY-MM-DD');
                    item.毕业时间 = moment(new Date((item.毕业时间 - 25569) * 86400 * 1000)).format('YYYY-MM-DD');
                }
                if(item.password){
                    item.password = sha256(item.password + item.username);
                }
                return item
            })
            if (props.item) {
                onChange(newArr[0])
                setVisible(false)
            } else {
                    props.API(newArr).then(() => {
                            message.success('导入成功！');
                            setVisible(false);
                        }
                    ).catch(() => {
                        // message.error('导入失败')
                    })
            }
        };
    };

    return (
        <>
            <Button onClick={() => {
                setVisible(true)
            }} type={props.btnType || 'primary'}>{props.btnName}</Button>
            {value && <>已上传</>}
            <Modal
                title={props.btnName}
                open={visible}
                onCancel={() => setVisible(false)}
            >
                <Dragger
                    maxCount={1}
                    accept={'.xlsx'}
                    customRequest={({file}) => handleUpload(file)}
                    showUploadList={false}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined/>
                    </p>
                    <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
                </Dragger>
            </Modal>
        </>
    )
}

export default BatchImport;