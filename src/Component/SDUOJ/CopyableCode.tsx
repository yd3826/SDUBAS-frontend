import React, {Component, Dispatch} from 'react';
import {connect} from "react-redux";
import Paragraph from "antd/lib/typography/Paragraph";

interface ICopyableCode {
    code: string
}

class CopyableCode extends Component<ICopyableCode, any> {

    render() {
        return (
            <>
                <Paragraph style={{fontSize: "14px"}}>
                    <pre style={{width: "100%", paddingRight: "25px"}}>{this.props.code}</pre>
                </Paragraph>
                <div style={{position: "absolute", right: "2%", top:"43px"}}>
                    <Paragraph
                        copyable={
                            {
                                tooltips: ["复制", "已复制"],
                                text: this.props.code
                            }}
                    />
                </div>
            </>
        )
    }
}

const mapStateToProps = (state: any) => {
    return{}
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CopyableCode)