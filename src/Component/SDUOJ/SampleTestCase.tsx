import React, {Component, Dispatch} from 'react';
import {connect} from "react-redux";
import {Col, Row, Skeleton} from "antd";
import CopyableCode from "./CopyableCode";
import Title from "antd/lib/typography/Title";


class SampleTestCase extends Component<any, any> {
    render() {
        return (
            <Skeleton active loading={this.props.testCase === undefined}>
                {
                    this.props.testCase !== undefined && (
                        this.props.testCase.map((value: any, index: number) => {
                            return (
                                <>
                                    <Title level={4}> {"样例" + " " + (index + 1)} </Title>
                                    <Row align={"top"} style={{fontSize: "16px"}}>
                                        <Col span={11}>
                                            {"输入"}:
                                            <CopyableCode code={value.input}/>
                                        </Col>
                                        <Col span={11} offset={1}>
                                            {"输出"}:
                                            <CopyableCode code={value.output}/>
                                        </Col>
                                    </Row>
                                </>
                            )
                        })
                    )
                }
            </Skeleton>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {}
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SampleTestCase)
