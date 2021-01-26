import React from 'react'
import { Result, Button, Typography } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const { Paragraph, Text } = Typography;

function ErrorPage(props) {

    const onClickHandler = () => {
        props.history.push('/login');
    }

    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Result
                status="error"
                title="로그인 실패"
                subTitle="해당 이메일은 이미 저희 사이트에 가입된 이메일입니다. "
                extra={[
                <Button type="primary" key="console" onClick={onClickHandler}>
                    Login / 로그인
                </Button>,
                ]}
            >
                <div className="desc">
                    <Paragraph>
                    <Text
                        strong
                        style={{
                        fontSize: 16,
                        }}
                    >
                    제출한 콘텐츠에 다음과 같은 오류가 있습니다:
                    </Text>
                    </Paragraph>
                    <Paragraph>
                        <CloseCircleOutlined className="site-result-demo-error-icon" /> 귀하의 계정은 이미 해당 사이트에 가입 되었습니다. 
                        <a href="http://localhost:3000/login"> 로그인 하러 가기 &gt;</a>
                    </Paragraph>

                    <Paragraph>
                        <CloseCircleOutlined className="site-result-demo-error-icon" /> 올바르지 않은 사용자의 계정입니다.
                    </Paragraph>
                </div>
            </Result>
        </div>
    )
}

export default ErrorPage
