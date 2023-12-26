import React, {Dispatch, useEffect, useRef, useState} from "react";
import {Button, Card, Form, Input, message, Modal, Space, Tabs} from "antd";
import {LoginForm, ProFormInstance, ProFormText} from "@ant-design/pro-form";
import {LockOutlined, UserOutlined,} from '@ant-design/icons';
import ForgetPass from "./Form/ForgetPass";
import {useDispatch} from "../../Redux/Store";
import {loginInfo} from "../../Type/types";
import getData from "../../API/getData";
import {useLocation, useNavigate} from "react-router-dom";
import ItemEmail from "./Form/Item/ItemEmail";
import {useForm} from "antd/es/form/Form";
import {Api} from "../../API/api";
import {sha256} from "js-sha256";
import md5 from "js-md5";

type LoginType = 'SDUCAS' | 'account';


const Login = (props: any) => {

    const formRef = useRef<ProFormInstance>()
    const [loading,setLoading] = useState<boolean|undefined>(undefined)
    const [loginType, setLoginType] = useState<LoginType>("account")
    const [first, setFirst] = useState(false);
    const [username,setUsername] = useState('');
    const [form] = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const login = (data: loginInfo) => {
        dispatch(getData(
            "login",
            {data: data},
            (r: any) => {
                if (!r.first_time) {
                    dispatch(getData(
                        "getProfile",
                        {},
                        (res: any) => {
                            dispatch({type: "setUserInfo", data: res});
                            dispatch({type: "userLogin"});
                            navigate("/c/home", {replace: true});
                        },
                        () => {
                            dispatch({type: "userLogout"});
                            props.jump && navigate("/login?to=" + location.pathname, {replace: true});
                            setLoading(false);
                        }
                    ))
                } else {
                    message.error('账户未激活')
                    setFirst(true);
                }
            },
            (detail: any) => {
                setLoading(false);
            }
        ))
    }
    return (
        <Card
            style={{width: "450px", textAlign: "center", margin: "0 auto"}}>
            <LoginForm
                formRef={formRef}
                title="用户登录"
                subTitle="山东大学区块链学习系统"
                actions={
                    <></>
                }
                submitter={{
                    resetButtonProps: false,
                    render: (prop: any, def: any) => {
                        if (loginType !== 'SDUCAS')
                            return <Button type={"primary"} block onClick={() => {
                                setLoading(true);
                                formRef.current?.validateFieldsReturnFormatValue?.()?.then((value: any) => {
                                    if (value.username && value.password){
                                        value.password = sha256(value.password+value.username)
                                        login(value);
                                    }
                                }).catch((value) => {
                                    let sf = []
                                    value.username && sf.push(
                                        {
                                            name: 'username',
                                            errors: ['用户名不能为空'],
                                        },
                                    )
                                    value.password && sf.push(
                                        {
                                            name: 'password',
                                            errors: ['密码不能为空'],
                                        },
                                    )
                                    formRef.current?.setFields(sf);
                                })
                            }
                            }
                            loading={loading}
                            > 登录 </Button>
                    },
                }}
            >
                <Tabs activeKey={loginType} onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                      items={[
                          {label: '账号密码登录', key: 'account'},
                      ]}
                >
                </Tabs>
                {loginType === 'account' && (
                    <>
                        <ProFormText
                            name="username"
                            fieldProps={{
                                size: 'large',
                                prefix: <UserOutlined className={'prefixIcon'}/>,
                                onPressEnter: () => {
                                    formRef.current?.validateFieldsReturnFormatValue?.()?.then((value: any) => {
                                        if (value.username && value.password){
                                            value.password = sha256(value.password+value.username)
                                            login(value);
                                        }
                                    }).catch(() => {
                                        formRef.current?.setFields(
                                            [
                                                {
                                                    name: 'username',
                                                    errors: ['用户名不能为空'],
                                                },
                                            ]
                                        )
                                    })
                                }
                            }}
                            placeholder={'请输入用户名'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined className={'prefixIcon'}/>,
                                onPressEnter: () => {
                                    formRef.current?.validateFieldsReturnFormatValue?.()?.then((value: any) => {
                                        if (value.username && value.password){
                                            value.password = sha256(value.password+value.username)
                                            login(value);
                                        }
                                    }).catch(() => {
                                        formRef.current?.setFields(
                                            [
                                                {
                                                    name: 'password',
                                                    errors: ['密码不能为空'],
                                                },
                                            ]
                                        )
                                    })
                                }
                            }}
                            placeholder={'请输入密码'}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                            ]}
                        />
                    </>
                )}
                {
                    loginType === 'account' && (
                        <div style={{
                            textAlign: "right", marginBottom: 10
                        }}>
                            <Space size={3}>
                                {/*<Register button={<Button type={"link"} size={"small"}>注册</Button>}/>*/}
                                <ForgetPass button={<Button type={"link"} size={"small"}>忘记密码</Button>}/>
                            </Space>
                        </div>
                    )
                }
            </LoginForm>
            <Modal
                title={'激活账户'}
                open={first}
                onCancel={() => {
                    setFirst(false)
                }}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={(values) => {
                        // console.log(values)
                        Api.active({data: values})
                            .then(() => {
                                message.success('激活成功')
                                setFirst(false)
                            })
                            .catch(() => {
                            })
                    }}
                >
                    <Form.Item name={'user_name'} label={'用户名'}
                        rules={[
                            {
                                required:true
                            }
                        ]}
                    >
                        <Input onChange={(e)=>{setUsername(e.target.value)}}/>
                    </Form.Item>
                    <ItemEmail needVerify={true}
                               getEmail={() => {
                                   return form.validateFields(["email"]).then((data: any) => {
                                       return Promise.resolve(data.email)
                                   }).catch(() => {
                                   })
                               }}
                               type={0}
                               exist={0}
                               username={username}
                               name={'token_s6'}
                    />
                    <Form.Item>
                        <Button htmlType={'submit'}>激活</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    )
}

export default Login;
