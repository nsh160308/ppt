import React, { useState } from "react";
import moment from "moment";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import {Form, Input, Button, Modal, message } from 'antd';
import Axios from 'axios';
import { USER_SERVER } from './../../Config';

//디자인
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

//디자인
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};




function RegisterPage(props) {
  const dispatch = useDispatch();
  
  //중복 확인 버튼 관리
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  //이메일 등록 성공 관리
  const [EmailSuccess, setEmailSuccess] = useState(false)
  //인증번호 관리
  const [VerifyKey, setVerifyKey] = useState("")
  //인증 성공 관리
  const [VerifySuccess, setVerifySuccess] = useState(false)
  //모달 상태 관리
  const [isModalVisible, setIsModalVisible] = useState(false);
  //바디 객체 관리
  const [BodyObj, setBodyObj] = useState({})

  //중복 이메일 체크 함수
  const duplicateCheckEmail = (newEmail) => {
    //잘 가져왔는지 체크
    console.log(newEmail);
    //만약 공백이면 백엔드 전송 중단
    if(newEmail === '') {
      return Modal.error({
        title: '등록 오류',
        content: '이메일을 입력하세요.'
      })
    }
    //이메일 body전송
    let variable = { email: newEmail }
    //백엔드로 전송
    Axios.post(`${USER_SERVER}/checkEmail`, variable)
      .then(result => {
        console.log(result.data);
        //true면 중복된 이메일
        if(result.data.duplicate) {
          Modal.error({
            title: '등록 오류',
            content: '중복된 이메일 입니다.'
          })
        } else {
          Modal.success({
            title: '등록 성공',
            content: '사용가능한 이메일 입니다.'
          })
          setEmailSuccess(true)
        }
      })
  }

  //인증 메일 보내기
  const sendEmail = (newEmail) => {
    //중복확인 안하고 보내려고 하면
    if(!EmailSuccess) {
      return Modal.error({
        title: '등록 오류',
        content: '중복 확인하세요.'
      })
    }
    //body 전송
    let variable = {
      email : newEmail
    }
    //백엔드로 전송
    Axios.post(`${USER_SERVER}/sendEmail`, variable)
      .then(result => {
        //백엔드에서 인증번호 가져왔다.
        console.log(result.data)
        setVerifyKey(result.data.verifyKey)
        
      })
  }

  //인증번호 확인 함수
  const verifyCheck = (verifyKey) => {
    //인증번호 잘 가져오는지 체크
    console.log(verifyKey)

    //값이 다르면
    if(VerifyKey !== verifyKey) {
      return Modal.error({
        title: '인증 오류',
        content: '인증번호가 맞지 않습니다.'
      })
    //같다면
    } else {
      Modal.success({
        title: '인증 성공',
        content: '인증번호가 맞습니다.'
      })
    }
    //인증성공 상태 true로 변경
    setVerifySuccess(true)
  }

  //모달 핸들링
  const handleOk = () => {
    setIsModalVisible(false)

    console.log(BodyObj);

    dispatch(registerUser(BodyObj))
      .then(result => {
        //액션반환값 가져오는지 확인
        console.log(result.payload)
        if(result.payload.success) {
          //성공했다면 로그인 페이지로 이동
          message.success("회원가입에 성공했습니다!")
          setTimeout(() => {
            props.history.push('/login')
          }, 2000);
          
        } else {
          Modal.error({
            title: "오류",
            content: '가입에 실패 했습니다.'
          })
        }
      })
  }
  const handleCancel = () => {
    setIsModalVisible(false)
  }

  //렌더링
  return (
    <>
    {/* 가입 확인 메세지 */}
    <Modal 
      title="주의 사항" 
      visible={isModalVisible} 
      onOk={handleOk} 
      onCancel={handleCancel}
      okText={"가입"}
      cancelText={"취소"}
    >
        <p>정말 가입 하시겠습니까?</p>
        
    </Modal>
    {/* 회원가입 폼 */}
    <Formik
      initialValues={{
        email: '',
        lastName: '',
        name: '',
        password: '',
        confirmPassword: ''
      }}
      // 유효성 검사
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .required('필수 항목'),
        lastName: Yup.string()
          .required('필수 항목'),
        email: Yup.string()
          .email('이메일 형식 오류')
          .required('필수 항목'),
        verifyKey: Yup.string()
          .required('필수 항목'),
        password: Yup.string()
          .min(6, '여섯 글자 이상 입력')
          .required('필수 항목'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], '비밀번호가 맞지 않습니다.')
          .required('필수 항목')
      })}
      // 회원 가입
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          //모달 보여주기
          setIsModalVisible(true);

          //body객체
          let dataToSubmit = {
            email: values.email,
            password: values.password,
            name: values.name,
            lastname: values.lastName,
            image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
          };
          
          //body 객체 저장
          setBodyObj(dataToSubmit)

          setSubmitting(false);
        }, 500);
      }}
    >
      {/* 내용 */}
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;
        return (
          <div className="app">
            <h2>회원 가입</h2>
            <Form style={{ minWidth: '525px' }} {...formItemLayout} onSubmit={handleSubmit} >

              <Form.Item required label="성">
                <Input
                  id="name"
                  placeholder="성"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.name && touched.name ? 'text-input error' : 'text-input'
                  }
                  autoComplete="off"
                />
                {errors.name && touched.name && (
                  <div className="input-feedback">{errors.name}</div>
                )}
              </Form.Item>

              <Form.Item required label="이름">
                <Input
                  id="lastName"
                  placeholder="이름"
                  type="text"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.lastName && touched.lastName ? 'text-input error' : 'text-input'
                  }
                  autoComplete="off"
                />
                {errors.lastName && touched.lastName && (
                  <div className="input-feedback">{errors.lastName}</div>
                )}
              </Form.Item>

              <Form.Item required label="이메일" >
                <div style={{ display: 'flex' }}>
                  <Input
                    id="email"
                    placeholder="이메일 입력"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.email && touched.email ? 'text-input error' : 'text-input'
                    }
                    disabled={EmailSuccess}
                    autoComplete="off"
                  />
                  {/* 이메일 중복확인 버튼 */}
                  {!EmailSuccess ?
                  <Button type="primary" 
                  disabled={ errors.email && touched.email ? !isButtonVisible : isButtonVisible} 
                  onClick={() => duplicateCheckEmail(values.email)}>
                  중복 확인
                  </Button>
                  :
                  <Button disabled={true}>확인 완료</Button>
                  }
                </div>
                
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
              </Form.Item>

              <Form.Item required label="인증번호" >
                <div style={{ display: 'flex' }}>
                  
                  <Input
                    id="verifyKey"
                    placeholder="인증번호 입력"
                    type="text"
                    value={values.verifyKey}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.verifyKey && touched.verifyKey ? 'text-input error' : 'text-input'
                    }
                    disabled={VerifySuccess}
                  />
                  {/* 이메일 인증번호 버튼 */}
                  {!VerifySuccess ? 
                  <>
                  <Button type="primary"  
                  onClick={() => sendEmail(values.email)}>
                  인증번호 전송
                  </Button>
                  <Button type="primary"
                  onClick={() => verifyCheck(values.verifyKey)}>
                    확인
                  </Button>
                  </>
                  :
                  <Button disabled>인증완료</Button>
                  }
                  
                </div>

                {errors.verifyKey && touched.verifyKey && (
                  <div className="input-feedback">{errors.verifyKey}</div>
                )}
              </Form.Item>

              <Form.Item required label="비밀번호" hasFeedback validateStatus={errors.password && touched.password ? "error" : 'success'}>
                <Input
                  id="password"
                  placeholder="최소 여섯 글자 이상"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password ? 'text-input error' : 'text-input'
                  }
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </Form.Item>

              <Form.Item required label="비밀번호 확인" >
                <Input
                  id="confirmPassword"
                  placeholder="비밀번호 확인"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.confirmPassword && touched.confirmPassword ? 'text-input error' : 'text-input'
                  }
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="input-feedback">{errors.confirmPassword}</div>
                )}
              </Form.Item>

              <Form.Item {...tailFormItemLayout}>
                <Button onClick={handleSubmit} type="primary" disabled={VerifySuccess ? isSubmitting : true}>
                  {VerifySuccess ? '가입하기' : '가입불가'}
                </Button>
              </Form.Item>
            </Form>
          </div>
        );
      }}
    </Formik>
    </>
  );
};


export default RegisterPage
