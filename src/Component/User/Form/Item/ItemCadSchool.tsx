import {Form, Select} from "antd";
import {useEffect, useState} from "react";
import {Api} from "../../../../API/api";

export const ItemCadSchool = (props: any) => {
    const [sOptions, setSOptions] = useState<any>([]);
    const [cOptions, setCOptions] = useState<any>([]);
    const [mOptions, setMOptions] = useState<any>([]);
    const [ccOptions, setCcOptions] = useState<any>([]);
    const [school, setSchool] = useState<any>(undefined);
    const [college, setCollege] = useState<any>(undefined);
    const [major, setMajor] = useState<any>(undefined);
    const [Class, setClass] = useState<any>(undefined);
    useEffect(() => {
        Api.getSchool({data: {pageSize: 100000, pageNow: 1}})
            .then((res: any) => {
                if (res.rows)
                    setSOptions(res.rows);
                else setSOptions([]);
            })
    }, [])
    useEffect(() => {
        if (school) {
            Api.getCollege({data: {school_id: school, pageNow: 1, pageSize: 100000}})
                .then((res: any) => {
                    if (res.rows)
                        setCOptions(res.rows);
                    else setCOptions([]);
                }).catch()
            //学校更改，子树清空
            setMOptions([])
            setCcOptions([])
            setCollege(undefined)
            setMajor(undefined)
            setClass(undefined);
        }
    }, [school])
    useEffect(() => {
        if (college) {
            Api.getMajor({data: {college_id: college, pageNow: 1, pageSize: 10000}})
                .then((res: any) => {
                    if (res.rows)
                        setMOptions(res.rows);
                    else setMOptions([])
                }).catch()
            Api.getClass({data: {college_id: college, pageNow: 1, pageSize: 10000}})
                .then((res: any) => {
                    if (res.rows)
                        setCcOptions(res.rows);
                    else setCcOptions([])
                })
            setMajor(undefined);
            setClass(undefined);
        }
    }, [college])
    return (
        <>
            <Form.Item
                label={'学校'}
                name={'school'}
            >
                <Select value={school} onChange={(e) => {
                    setSchool(e)
                }}>
                    {
                        sOptions.map((option: any) => {
                            return (
                                <Select.Option
                                    key={option.id}
                                    value={option.id}
                                >
                                    {option.name}
                                </Select.Option>
                            )
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item
                label={'学院'}
                name={'college'}
            >
                <Select value={college} onChange={(e) => {
                    setCollege(e)
                }}>
                    {
                        cOptions.map((option: any) => {
                            return (
                                <Select.Option
                                    key={option.id}
                                    value={option.id}
                                >
                                    {option.name}
                                </Select.Option>
                            )
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item
                label={'专业'}
                name={'major_id'}
            >
                <Select value={major} onChange={(e) => {
                    setMajor(e)
                }}>
                    {
                        mOptions.map((option: any) => {
                            return (
                                <Select.Option
                                    key={option.id}
                                    value={option.id}
                                >
                                    {option.name}
                                </Select.Option>
                            )
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item
                label={'班级'}
                name={'class_id'}
                shouldUpdate
            >
                <Select value={Class} onChange={(e) => {
                    setClass(e)
                }}>
                    {
                        ccOptions.map((option: any) => {
                            return (
                                <Select.Option
                                    key={option.id}
                                    value={option.id}
                                >
                                    {option.name}
                                </Select.Option>
                            )
                        })
                    }
                </Select>
            </Form.Item>
        </>
    )
}