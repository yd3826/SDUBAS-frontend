import TableWithPagination from "../../Component/Common/Table/TableWithPagination";
import {
    Card,
    Form,
    Input,
    List, Select,
    Space, Tabs,
} from "antd";
import ProCard from "../../Component/Project/ProCard";
import {useNavigate} from "react-router-dom";
import ModalFormUseForm from "../../Component/Common/Form/ModalFormUseForm";
import ProjectForm1 from "../../Component/Project/Form/ProjectForm1";
import {Api} from "../../API/api";
import ProjectForm2 from "../../Component/Project/Form/ProjectForm2";
import {arraytostr} from "../../Utils/arraytostr";
import {tagOptions} from "../../Config/Project/data";
import {useEffect} from "react";
import {useDispatch} from "../../Redux/Store";


const Experiment = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        Api.getUserPermission({data: {service_type: 7}})
            .then((res: any) => {
                    dispatch({type:'setUserPermission',service_type:7,data:res.map((e: any) => e.label)})
                }
            ).catch(()=>{})
    }, [])

    return (
        <Tabs
            items={[
                {
                    key:'0',
                    label:'实验平台',
                    children:<div className={"table-container"}>
                        <Card
                            title={'实验平台'}
                            headStyle={{textAlign: 'left'}}
                            style={{minWidth: '1000px'}}
                            bordered={false}
                            extra={
                                <ModalFormUseForm
                                    title={'新建实验'}
                                    type={'create'}
                                    btnName={'新建实验'}
                                    TableName={'ExperimentMainTable'}
                                    subForm={[
                                        {
                                            component: ProjectForm1({type: '实验'}),
                                            label: "",
                                        },
                                        {
                                            component: ProjectForm2({service_type: 7}),
                                            label: ""
                                        }
                                    ]}
                                    dataSubmitter={(value: any) => {
                                        // console.log('up', value);
                                        value.tag = arraytostr(value.tag);
                                        value.contents.forEach((e: any) => {
                                            e.feature = JSON.stringify(e.feature);
                                        })
                                        return Api.newPro({
                                            data: value
                                        });
                                    }}
                                />}
                        >
                            <div
                                className={"proCard-container"}
                            >
                                <TableWithPagination
                                    name={'ExperimentMainTable'}
                                    useList={true}
                                    API={async (data: any) => {
                                        if (data.tag)
                                            data.tag = arraytostr(data.tag);
                                        else data.tag = ''
                                        return Api.getProListByType({data: {projectType: '实验', ...data}})
                                    }}
                                    // initData={initData}
                                    size={'small'}
                                    getForm={(onFinish: any) => {
                                        return (
                                            <Space size={30}>
                                                <Form.Item label={'标签'} name={'tag'}>
                                                    <Select onChange={onFinish} mode={'multiple'}
                                                            style={{width: 120, height: '30px'}} maxTagCount='responsive'>
                                                        {tagOptions.map((option: any) => {
                                                            return (<Select.Option key={option.key}
                                                                                   value={option.key}>{option.value}</Select.Option>)
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item label={"名称"} name={"project_name"}>
                                                    <Input onPressEnter={onFinish}/>
                                                </Form.Item>
                                            </Space>
                                        );
                                    }}
                                    useFormBtn={false}
                                    defaultPageSize={12}
                                    renderItem={(item: any) => {
                                        return (
                                            <List.Item key={item.name}>
                                                <ProCard item={item} TableName={'ExperimentMainTable'}/>
                                            </List.Item>
                                        )
                                    }}
                                />
                            </div>
                        </Card>
                    </div>
                },
                {
                    key:'1',
                    label:'自动化评测实验',
                    children: <div className={"table-container"}>
                        <Card
                            title={'自动化评测实验'}
                            headStyle={{textAlign: 'left'}}
                            style={{minWidth: '1000px'}}
                            bordered={false}
                        >
                            <div
                                className={"proCard-container"}
                            >
                                <TableWithPagination
                                    name={'SDUOJProTable'}
                                    useList={true}
                                    API={async (data: any) => {
                                        // to do
                                        return Api.getOjPro(data)
                                    }}
                                    // initData={initData}
                                    size={'small'}
                                    defaultPageSize={12}
                                    renderItem={(item: any) => {
                                        return (
                                            <List.Item key={item.name}>
                                                <ProCard item={item} TableName={'SDUOJProTable'}/>
                                            </List.Item>
                                        )
                                    }}
                                />
                            </div>
                        </Card>
                    </div>
                }
            ]}
        >

        </Tabs>

    );
}

export default Experiment;