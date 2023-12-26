import {useSelector} from "react-redux";
import {IState} from "../../Type/base";
import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Space} from "antd";
import {ModalForm} from "@ant-design/pro-form";
import ItemPassword from "../../Component/User/Form/Item/ItemPassword";
import {Api} from "../../API/api";
import getData from "../../API/getData";
import {useDispatch} from "../../Redux/Store";
import '../../Config/CSS/UserInfo.css'
import {useNavigate} from "react-router-dom";
import EditableInput from "../../Component/User/EditableInput";
import {useForm} from "antd/es/form/Form";
import ItemEmail from "../../Component/User/Form/Item/ItemEmail";
import {sha256} from "js-sha256";
import ModalFormUseForm from "../../Component/Common/Form/ModalFormUseForm";
import {IKeyState} from "../../Type/key";
import JSEncrypt from "jsencrypt";
import {Confirm} from "../../Component/Common/DeleteConfirm";


const UserInfo = () => {
    const userPro = useSelector((state: IState) => state.UserReducer.userInfo);
    const RSAKey = '-----BEGIN PUBLIC KEY-----\n' +
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4E3IBJNbshjWs/VoGFAc\n' +
        'uGV5EjwOVLvbegDw6zfIKUM+XwwQu146RwEsyvMm1yNDxdofQdzxlkNUEwHjGup1\n' +
        'nJdRDUlJj/hTGVF87iCVUzL80vH0n2kGMCvYBXpBQ80SgEPWznQQbW7x9jUeyXMU\n' +
        'pV/QBxZoiibBYqFaoeY+XNcT1e4fD3+epod59Zcn4sMli80499geP9dU6Q9r2gdW\n' +
        '9DZuInrfzao18iFSjgCc9vSp6UZ2NKBYYNCpZvuTvF+gc+5UZf1Kos4an9912yvK\n' +
        'ReIGTlGgP8ytvA1rtB9NFKy1sSu+f9uLLc/CtUn3qu8cgBW2CPsrFgG17EnNLN+p\n' +
        'uQIDAQAB\n' +
        '-----END PUBLIC KEY-----\n'
    const [username, setUsername] = useState(userPro?.username)
    const [email, setEmail] = useState(userPro?.email)
    const [oj_username,setOjUsername] = useState(userPro?.oj_username);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = useForm<any>();
    useEffect(() => {
        if (userPro) {
            setUsername(userPro.username);
            setEmail(userPro.email);
            setOjUsername(userPro.oj_username);
        }
    }, [userPro])
    return (
        <div className="user-info-container">
            <div className="user-info-header">
                <h1 className="user-info-title">用户信息</h1>
                <ModalForm<any>
                    title={'修改密码'}
                    autoFocusFirstInput
                    trigger={<Button type={'link'}>修改密码</Button>}
                    modalProps={{
                        maskClosable: false,
                        destroyOnClose: true,
                        width: 500,
                        okText: "提交"
                    }}
                    onFinish={(values) => {
                        //将密码+用户名加密发送到后端
                        values.old_password = sha256(values.old_password + username);
                        values.new_password = sha256(values.new_password + username);
                        return Api.updatePwd({data: values}).then((res: any) => {
                            dispatch(getData(
                                'logout',
                                {},
                                () => {
                                    dispatch({type: 'userLogout'});
                                    dispatch({type: 'clearRedux'});
                                },
                                (error: any) => {
                                    message.error(error);
                                }
                            ))
                            message.success('修改成功,请重新登录');
                            navigate('/c/login', {replace: true});
                        }).catch((error: any) => {

                        })
                    }}
                >
                    {/*<Form.Item*/}
                    {/*    name={'old_password'}*/}
                    {/*    label={'旧密码'}*/}
                    {/*    rules={[*/}
                    {/*        {*/}
                    {/*            required: true,*/}
                    {/*            message: 'oldPasswordEmpty'*/}
                    {/*        },*/}
                    {/*    ]}*/}
                    {/*>*/}
                    {/*    <Input.Password/>*/}
                    {/*</Form.Item>*/}
                    <ItemPassword oldpass={true}/>
                    <ItemPassword newpass={true}/>
                </ModalForm>
            </div>
            <Space
                direction={'vertical'}
                size={'large'}
            >
                {/*<EditableInput*/}
                {/*    label={'用户名'}*/}
                {/*    onClick={async (data: any) => {*/}
                {/*        return Api.updateUsername({data: {username: data}});*/}
                {/*    }}*/}
                {/*    defaultValue={userPro?.username}*/}
                {/*/>*/}
                <div
                    style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                >
                    <div style={{minWidth: "100px"}}>用户名:</div>
                    <Input value={username} disabled/>
                </div>
                <EditableInput
                    label={'邮箱'}
                    editable={false}
                    defaultValue={email}
                    addonAfter={
                        <ModalForm
                            title={"修改邮箱"}
                            trigger={<Button type={'link'}>修改</Button>}
                            autoFocusFirstInput
                            modalProps={{
                                maskClosable: false,
                                destroyOnClose: true,
                                width: 500,
                                okText: "提交"
                            }}
                            form={form}
                            onFinish={(data: any) => {
                                return Api.updateEmail({data: data}).then((res: any) => {
                                    message.success('绑定成功');
                                    dispatch(getData(
                                        "getProfile",
                                        {},
                                        (res: any) => {
                                            // console.log(res);
                                            dispatch({type: "setUserInfo", data: res});
                                        },
                                        () => {
                                        }
                                    ))
                                    return true;
                                }).catch((error: any) => {
                                })
                            }
                            }
                        >
                            <ItemEmail
                                name={'token_s6'}
                                needVerify={true}
                                exist={true}
                                getEmail={() => {
                                    return form.validateFields(["email"]).then((data: any) => {
                                        return Promise.resolve(data.email)
                                    }).catch(() => {
                                    })
                                }}
                                type={1}
                            />
                        </ModalForm>
                    }
                />
                {/*<div*/}
                {/*    style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}*/}
                {/*>*/}
                {/*    <div style={{minWidth: "100px"}}>用户名:</div>*/}
                {/*    <Input value={userPro?.username} disabled />*/}
                {/*</div>*/}
                {/*<div*/}
                {/*    style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}*/}
                {/*>*/}
                {/*    <div style={{minWidth: "100px"}}>邮箱:</div>*/}
                {/*    <Input value={userPro?.email} disabled />*/}
                {/*</div>*/}
                {/*<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>*/}
                {/*    /!*<div style={{width: '400px', flex: 1}}>*!/*/}
                {/*    /!*    {2===2*!/*/}
                {/*    /!*        ? (<>已绑定</>)*!/*/}
                {/*    /!*        : (<ModalFormUseForm*!/*/}
                {/*    /!*                title={'绑定个人信息'}*!/*/}
                {/*    /!*                subForm={[*!/*/}
                {/*    /!*                    {*!/*/}
                {/*    /!*                        component: BindForm,*!/*/}
                {/*    /!*                        label: ''*!/*/}
                {/*    /!*                    }*!/*/}
                {/*    /!*                ]}*!/*/}
                {/*    /!*                type={'create'}*!/*/}
                {/*    /!*                btnName={'点击绑定'}*!/*/}
                {/*    /!*                dataSubmitter={async (data: any) => {*!/*/}
                {/*    /!*                    data.enrollment_dt = data.enrollment_dt.format("YYYY-MM-DD")*!/*/}
                {/*    /!*                    data.graduation_dt = data.graduation_dt.format("YYYY-MM-DD")*!/*/}
                {/*    /!*                    data.gender = data.gender.toString();*!/*/}
                {/*    /!*                    // console.log('bind',data);*!/*/}
                {/*    /!*                    return Api.bind({data: data});*!/*/}
                {/*    /!*                }}*!/*/}
                {/*    /!*                afterSubmit={(r:any) => {*!/*/}
                {/*    /!*                    dispatch(getData(*!/*/}
                {/*    /!*                        "getProfile",*!/*/}
                {/*    /!*                        {},*!/*/}
                {/*    /!*                        (res: any) => {*!/*/}
                {/*    /!*                            // console.log(res);*!/*/}
                {/*    /!*                            dispatch({type: "setUserInfo", data: res});*!/*/}
                {/*    /!*                        },*!/*/}
                {/*    /!*                        () => {*!/*/}
                {/*    /!*                        }*!/*/}
                {/*    /!*                    ))*!/*/}
                {/*    /!*                }}*!/*/}
                {/*    /!*            />*!/*/}
                {/*    /!*        )*!/*/}
                {/*    /!*    }*!/*/}
                {/*    /!*</div>*!/*/}
                {/*</div>*/}
                {
                    userPro?.oj_bind === 1? (
                        <>
                            <div
                                style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                            >
                                <div style={{minWidth: "100px"}}>SDUOJ用户名:</div>
                                <Input value={oj_username} disabled/>
                                <Confirm
                                    title={'确认解绑'}
                                    onConfirm={()=>{
                                        //解绑API
                                        Api.unbindOj().then(()=>{
                                            dispatch(getData(
                                                "getProfile",
                                                {},
                                                (res: any) => {
                                                    dispatch({type: "setUserInfo", data: res});
                                                },
                                                () => {
                                                }
                                            ))
                                        }).catch(()=>{})
                                    }}
                                    content={
                                        <Button type={'link'} danger>解绑</Button>
                                    }
                                />
                            </div>
                        </>
                    ) : (
                        <div style={{display:'flex',gap:'50px'}}>
                            <label style={{marginTop:'8px',minWidth:'100px'}}>绑定SDUOJ账户:</label>
                            <ModalFormUseForm
                                title={'绑定SDUOJ账户'}
                                btnType={'link'}
                                btnName={'绑定'}
                                subForm={[
                                    {
                                        component: (
                                            <>
                                                <Form.Item
                                                    name={'oj_username'}
                                                    label={'SDUOJ用户名'}
                                                    rules={[{
                                                        required: true,
                                                        message: '输入用户名'
                                                    }]}
                                                >
                                                    <Input placeholder={'用户名'}/>
                                                </Form.Item>
                                                <Form.Item
                                                    name={'oj_password'}
                                                    label={'SDUOJ密码'}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '输入密码'
                                                        }
                                                    ]}
                                                >
                                                    <Input.Password placeholder={'密码'}/>
                                                </Form.Item>
                                            </>
                                        ),
                                        label: ''
                                    }
                                ]}
                                dataSubmitter={async (data: any) => {
                                    const rsaEncrypt = new JSEncrypt();
                                    rsaEncrypt.setPublicKey(RSAKey);
                                    data.oj_password = rsaEncrypt.encrypt(data.oj_password);
                                    return Api.bindOJ({data: data})
                                }}
                                afterSubmit={async ()=>{
                                    dispatch(getData(
                                        "getProfile",
                                        {},
                                        (res: any) => {
                                            dispatch({type: "setUserInfo", data: res});
                                        },
                                        () => {
                                        }
                                    ))
                                }}
                            />
                        </div>
                    )
                }
            </Space>
        </div>
    );
}

export default UserInfo;