import {Button, Card, Form, List, message, Space, Table} from "antd";
import React, { useEffect, useState} from "react";
import {defaultPageSize} from "../../../Config/constValue";
import {IState} from "../../../Type/base";
import Search from "antd/es/input/Search";
import {ck} from "../../../Utils/isValueEmpty";
import {SizeType} from "antd/lib/config-provider/SizeContext";
import {ColumnsType} from "antd/lib/table/interface";
import {useForm} from "antd/es/form/Form";
import {useSelector} from "react-redux";
import {ITablePageInfo} from "../../../Type/table";
import {useDispatch} from "../../../Redux/Store";


export interface TableWithPaginationProps {
    API: any                  // 表格查询数据的接口
    size: SizeType            // 表格的大小
    columns: ColumnsType<any> // 表格的列
    name: string              // 表格名称
    APIRowsTransForm?: any    // 针对API传输的数据进行转化的函数
    search?: boolean          // 是否开启搜索功能
    defaultPageSize?: number  // 表格默认的页大小

    // 面向 可选择的行 开放的接口
    // setDataSource?: any       // 输出当前表格的数据
    rowKey?: any              // 作为 key 记录的值
    rowSelection?: any        // 可选列的相关配置
}

const TableWithPagination = (props: any) => {
    // const roles = useSelector((state: IState) => state.UserReducer.userInfo?.roles);
    const tbData = useSelector((state: IState) => {
        return {...state.TableReducer.tableData}
    });
    const dispatch = useDispatch();
    const [total, setTotal] = useState<number>(0)                   // 项的总数
    const [tableData, setTableDataX] = useState()                            // 表格核心数据
    const [loading, setLoading] = useState(true)                    // 表格的加载状态
    const [PageNow, setPageNow] = useState<number>(1)               // 当前的页码数
    const [PageSize, setPageSize] = useState<number>(ck(props.defaultPageSize, defaultPageSize))         // 当前的页大小
    const [searchText, setSearchText] = useState<string>("")        // 搜索的文本
    const [tableVersion, setTableVersion] = useState<number>(0)     // 表格版本（控制表格刷新）

    const setTableData = (data: any) => {
        setTableDataX(data)
        // 若有 选中行 的相关配置，传递数据进行更新
        if (setDataSource !== undefined && props.name !== undefined)
            setDataSource(data, props.name)
    }
    const setTableInfo = (name: string, data: ITablePageInfo) => {
        dispatch({
            type: "setTablePageInfo",
            name: name,
            data: data
        })
    }
    const setDataSource = (data: any, name: string) => {
        dispatch({type: "setDataSource", data: data, name: name, add: false})
    }
    // 这里的所有的参数都只能增量的修改，不能删除，删除需要手动更新 redux
    const getInfo = (pageNow?: number, pageSize?: number, searchKey?: string, moreProps?: any) => {
        const propsTableInfo = tbData[props.name]?.tablePageInfo
        if (propsTableInfo !== undefined) {
            if (moreProps === undefined && propsTableInfo.moreProps !== undefined) {
                form.setFieldsValue(propsTableInfo.moreProps)
            }
            pageNow = pageNow ?? propsTableInfo.pageNow
            pageSize = pageSize ?? propsTableInfo.pageSize
            searchKey = searchKey ?? propsTableInfo.searchKey
            moreProps = moreProps ?? propsTableInfo.moreProps
        }
        let pn = pageNow ?? PageNow
        let ps = pageSize ?? PageSize
        let sk = searchKey ?? searchText
        let fmp = moreProps ?? form.getFieldsValue()
        setPageNow(pn)
        setPageSize(ps)
        setSearchText(sk)
        setLoading(true)
        props.API({
            pageNow: pn,
            pageSize: ps,
            searchKey: sk,
            ...fmp
        }).then((data: any) => {
            // console.log('data',data)
            if (data.rows === null) data.rows = []
            if (props.APIRowsTransForm !== undefined) {
                setTableData(props.APIRowsTransForm(data))
            } else setTableData(data.rows)
            if (data.totalNum !== undefined && data.totalNum !== "0") {
                setTotal(data.totalNum)
                props.name && setTableInfo(props.name, {
                    total: data.totalNum,
                    pageNow: pn,
                    pageSize: ps,
                    searchKey: sk,
                    moreProps: fmp
                })
            } else {
                setTotal(ps * data.totalPage);
                props.name && setTableInfo(props.name, {
                    total: ps * data.totalPage,
                    pageNow: pn,
                    pageSize: ps,
                    searchKey: sk,
                    moreProps: fmp
                })
            }
            setLoading(false)
        }).catch((error:any)=>{setLoading(false)})
    }

    useEffect(() => {
        form.setFieldsValue(props.initRequestProps)
        getInfo()
    }, [props.name])

    // 带有表单的筛选
    const [form] = useForm()
    const onFinish = () => {
        const values = form.getFieldsValue()
        if (JSON.stringify(values) !== "{}")
            getInfo(PageNow, PageSize, undefined, values)
    };
    const onReset = () => {
        const values = form.getFieldsValue()
        form.resetFields();
        const tf = tbData[props.name]?.tablePageInfo;
        props.name && setTableInfo(props.name, {
            total: tf?.total || 0,
            pageNow: tf?.pageNow || 0,
            pageSize: tf?.pageSize || 0,
            searchKey: tf?.searchKey || "",
            moreProps: undefined
        })
        const valuesAfter = form.getFieldsValue()
        // console.log(valuesAfter)
        // 重置前后若发生改变，则重新加载表格
        if (JSON.stringify(values) !== JSON.stringify(valuesAfter))
            getInfo(1, PageSize, undefined, undefined)

    };


    useEffect(() => {
        // 监听表格的版本变化，当版本变更时更新表格
        const propsTableVersion = tbData[props.name]?.tableVersion
        if (propsTableVersion !== undefined && tableVersion !== propsTableVersion) {
            // 如果数据被外部应用更新，则用 redux 中的数据更新当前行
            if (propsTableVersion < 0) {
                const newTableVersion = -propsTableVersion;
                if (newTableVersion !== tableVersion) {
                    setTableVersion(-propsTableVersion)
                    setTableDataX(tbData[props.name]?.dataSource)
                }
            } else {
                // 否则，重新进行请求
                setTableVersion(propsTableVersion)
                const values = form.getFieldsValue()
                getInfo(PageNow, PageSize, searchText, values)
            }
        }
    }, [tbData,tableVersion])

    return (
        <>
            {props.useList && (
                <Card
                    title={props.title}
                    bordered={true}
                    size={"default"}
                    className={props.cardProps ?? "zeroBodyPaddingLeft"}
                    extra={
                        (props.search === true || props.getForm !== undefined) && (
                            <>
                                {props.search === true && (
                                    <Search
                                        key={"search"}
                                        placeholder={"searchUser"}
                                        onSearch={(text) => {
                                            setSearchText(text)
                                            setPageNow(1)
                                            const values = form.getFieldsValue()
                                            getInfo(1, PageSize, text, values)
                                        }}
                                        enterButton
                                        style={{width: 300}}
                                    />
                                )}
                                {props.getForm !== undefined && (
                                    <Form form={form}>
                                        {props.getForm(onFinish)}
                                        {props.useFormBtn && (
                                            <Space style={{marginLeft: "30px"}} size={20}>
                                                <Button type="primary" onClick={onFinish}>
                                                    筛选
                                                </Button>
                                                <Button htmlType="button" onClick={onReset}>
                                                    重置
                                                </Button>
                                            </Space>
                                        )}
                                    </Form>
                                )}
                            </>
                        )
                    }
                >
                    <List
                        grid={props.grid}
                        itemLayout={"vertical"}
                        loading={loading}
                        size={props.size}
                        dataSource={tableData}
                        renderItem={props.renderItem}
                        pagination={{
                            onChange: (page, pageSize) => {
                                getInfo(page, pageSize)
                            },
                            current: PageNow,
                            pageSize: PageSize,
                            total: total,
                            size: "small",
                            hideOnSinglePage: true,
                            showQuickJumper: true,
                            showLessItems: true,
                            showSizeChanger: ck(props.showSizeChanger, true),
                            pageSizeOptions: ["5", "15", "20", "50", "80"],
                        }}
                    />
                </Card>
            )}
            {!props.useList && (
                <Card
                    bordered={false}
                    size={"small"}
                    extra={
                        (props.search === true || props.getForm !== undefined) && (
                            <>
                                {props.search === true && (
                                    <Search
                                        key={"search"}
                                        placeholder={"搜索"}
                                        onSearch={(text) => {
                                            setSearchText(text)
                                            setPageNow(1)
                                            getInfo(1, PageSize, text)
                                        }}
                                        enterButton
                                        style={{width: 300}}
                                    />
                                )}
                                {props.getForm !== undefined && (
                                    <Form form={form}>
                                        {props.getForm(onFinish)}
                                        {props.useFormBtn&&(
                                            <Space style={{marginLeft: "30px"}} size={20}>
                                                <Button type="primary" onClick={onFinish}>
                                                    筛选
                                                </Button>
                                                <Button htmlType="button" onClick={onReset}>
                                                    重置
                                                </Button>
                                            </Space>
                                        )}
                                    </Form>
                                )}
                            </>
                        )
                    }
                >
                    <Table
                        rowKey={props.rowKey}
                        loading={loading}
                        size={props.size}
                        columns={props.columns}
                        rowSelection={props.rowSelection}
                        dataSource={tableData}
                        pagination={{
                            onChange: (page, pageSize) => {
                                getInfo(page, pageSize)
                            },
                            current: PageNow,
                            pageSize: PageSize,
                            total: total,
                            hideOnSinglePage: true,
                            showQuickJumper: true,
                            showLessItems: true,
                            showSizeChanger: ck(props.showSizeChanger, true),
                            pageSizeOptions: ["5", "15", "20", "50", "80"],
                        }}
                        {...props}
                    />
                </Card>
            )}
        </>
    )

}

export default TableWithPagination;
