import {Form, Select} from "antd";

const ItemType = (props: any) => {
    // const [select,setSelect] = useState(props.default);
    // const handleChange = (value:any)=>{
    //     console.log(value);
    //     setSelect(value);
    // }
    return (
        <>
            <Form.Item label={props.label} name={props.name}
                       initialValue={props.default||undefined}
                       rules={[
                           {
                               required: props.required,
                               message: props.required ? `请选择${props.label}` : undefined
                           }
                       ]}
            >
                <Select mode={props.mode} disabled={props.disabled}>
                    {props.options.map((option: { key: string, value: string }) => {
                        return (
                            <Select.Option key={option.key} value={option.key}>{option.value}</Select.Option>
                        );
                    })}
                </Select>
            </Form.Item>
        </>
    );
}

export default ItemType;