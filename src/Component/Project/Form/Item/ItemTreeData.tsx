import {Button, Form, Input, message, Select, Space, Upload} from "antd";
import {useEffect, useState} from "react";
import { UploadOutlined } from "@ant-design/icons";
import EditableCell from "../EditableCellProps";
interface DataNode {
    id: number;
    name: string;
    faId: number | undefined;
}

const ItemTreeData = (props: any) => {
    const [treeData, setTreeData] = useState<any>(undefined)
    let nodeId = 0;
    useEffect(() => {
        // console.log(props.value);
        let initState:DataNode[] = [];
        if (props.value !== undefined&&treeData===undefined) {
            for (let i = 0; i < props.value.length; i++) {
                const newNode: DataNode = {
                    id: props.value[i].id,
                    name: props.value[i].name,
                    faId: props.value[i].faId,
                }
                initState.push(newNode);
            }
        }
        setTreeData(initState);
    }, [])

    const generateNodeId = (): number => {
        return (nodeId++)
    };

    const handleAddNode = () => {
        const newNode: DataNode = {
            id: generateNodeId(),
            name: "",
            faId: undefined,
        };
        setTreeData((prevTreeData:DataNode[]) => [...prevTreeData, newNode]);
    };

    const handleRemoveNode = (id: number) => {
        const isParentNode = treeData.some((node:DataNode) => node.faId === id);
        if (isParentNode) {
            message.error("请检查依赖关系");
            return false;
        }
        setTreeData((prevTreeData:DataNode[]) => prevTreeData.filter((node) => node.id !== id));
        return true;
    };

    const handleNodeTitleChange = (index: number, value: string) => {
        let newTree = treeData.slice();
        newTree[index] = {...newTree[index], name: value}
        setTreeData(newTree);
    };
    const handleNodeWeightChange = (index: number, value: string) => {
        let newTree = treeData.slice();
        newTree[index] = {...newTree[index], weight: value}
        setTreeData(newTree);
    }

    const handleNodeFaIdChange = (index: number, value: string) => {
        let newTree = treeData.slice();
        newTree[index] = {...newTree[index], faId: value};
        setTreeData(newTree);
    };


    return (
            <Form.List name={'contents'}>
                {(fields, {add, remove}) => (
                    <>
                        {fields.map((field) => (
                            <Space key={field.name} style={{marginBottom: 8}}>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "name"]}
                                    key={field.name + 'title'}
                                    noStyle
                                >
                                    <Input
                                        placeholder="Node title"
                                        onChange={(e) =>
                                            handleNodeTitleChange(field.name, e.target.value)
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    name={[field.name, "faId"]}
                                    key={field.name + 'faId'}
                                    noStyle
                                >
                                    <Select
                                        style={{width: 120}}
                                        onChange={(value) =>
                                            handleNodeFaIdChange(field.name, value)
                                        }
                                    >
                                        <Select.Option key={null} value={undefined}>
                                            None
                                        </Select.Option>
                                        {treeData&&treeData
                                            .filter((n:DataNode) => n.id !== treeData[field.name].id)
                                            .map((n:DataNode) => (
                                                <Select.Option key={n.id} value={n.id}>
                                                    {n.name}
                                                </Select.Option>
                                            ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'id']}
                                    key={field.name + 'id'}
                                    initialValue={treeData?treeData[field.name].id:undefined}
                                    noStyle
                                >
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'weight']}
                                    key={field.name + 'weight'}
                                    noStyle
                                >
                                    <Input placeholder="Node weight"
                                           onChange={(e) =>
                                               handleNodeWeightChange(field.name, e.target.value)
                                           }/>
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'type']}
                                    key={field.name + 'type'}
                                    noStyle
                                >
                                    <Select style={{width: 80}}>
                                        {props.options.map((option: { key: string, value: string }) => {
                                            return (
                                                <Select.Option
                                                    key={option.key}
                                                    value={option.key}>
                                                    {option.value}
                                                </Select.Option>
                                            )
                                        })}
                                    </Select>
                                </Form.Item>
                                <Button
                                    type={'link'}
                                    style={{width: 50}}
                                    onClick={() => {
                                        if (handleRemoveNode(treeData[field.name].id)) remove(field.name)
                                    }}>
                                    Remove
                                </Button>
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => {
                                add();
                                handleAddNode();
                            }} style={{marginBottom: 8}}>
                                添加
                            </Button>
                        </Form.Item>
                    </>
                )
                }
            </Form.List>
    );
};

export default ItemTreeData;