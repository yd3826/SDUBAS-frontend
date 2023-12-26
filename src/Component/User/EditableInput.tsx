import {useEffect, useState} from "react";
import {Button, Input, message} from "antd";
import getData from "../../API/getData";
import {useDispatch} from "../../Redux/Store";
import {useSelector} from "react-redux";
import {IState} from "../../Type/base";

const EditableInput = (props: any) => {
    const [isEdit, setIsEdit] = useState(false);
    const [value, setValue] = useState(props.defaultValue);
    const dispatch = useDispatch();
    useEffect(()=>{
        setValue(props.defaultValue)
    },[props])
    const handleClick = () => {
        setIsEdit(true);
    }
    const onClick = () => {
        props.onClick(value).then(() => {
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
            message.success('保存成功');
            setIsEdit(false);
        }).catch(() => {
            setValue(props.defaultValue);
        });
    }
    return (
        <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
        >
            <div style={{minWidth: "100px"}}>{props.label}:</div>
            <Input
                style={{width: '400px', flex: 1}}
                value={value}
                onChange={(e)=>{setValue(e.target.value);}}
                addonAfter={props.addonAfter?props.addonAfter:
                    (!isEdit ? <Button type={'link'} onClick={handleClick}>修改</Button>
                        : <>
                            <Button type={'link'} onClick={onClick}>保存</Button>
                            <Button type={'link'} danger={true} onClick={()=>{setIsEdit(false)}}>取消</Button>
                        </>)
                }
                disabled={!isEdit}
            />
        </div>
    )
}

export default EditableInput;