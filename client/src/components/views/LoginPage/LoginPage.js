import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Axios from "axios";
import { Button, Typography } from 'antd';
import {
  GoogleOutlined,
  FacebookOutlined,
  MessageOutlined 
} from '@ant-design/icons';

function LoginPage(props) {

  const { register, handleSubmit, errors } = useForm();
  const [errorsFromSubmit, setErrorsFromSubmit] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    const body = {
      email: data.email,
      password: data.password
    }

    console.log('해당 데이터로 로그인 시도', body);

    try {
      setLoading(true)
      await Axios.post(`/api/users/login`, body)
      props.history.push("/");
      setLoading(false)
    } catch (error) {
      setErrorsFromSubmit(error.message)
      setLoading(false)
      setTimeout(() => {
        setErrorsFromSubmit("")
      }, 5000);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="form">
        <div style={{ textAlign: 'center' }}>
          <h2>Login</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            ref={register({ required: true, pattern: /^\S+@\S+$/i })}
          />
          {errors.email && <p>This email field is required</p>}

          <label>Password</label>
          <input
            name="password"
            type="password"
            ref={register({ required: true, minLength: 6 })}
          />
          {errors.password && errors.password.type === "required"
            && <p> This name field is required</p>}
          {errors.password && errors.password.type === "minLength"
            && <p> Password must have at least 6 characters</p>}

          {errorsFromSubmit &&
            <p>{errorsFromSubmit}</p>
          }

          <input type="submit"
            style={{ marginTop: '40px' }}
            disabled={loading} />

        </form>
        <div >
          <Link style={{ color: 'gray', textDecoration: 'none' }} to="/register">If you dont have an account yet...</Link>
        </div>
          <a href="http://localhost:5000/auth/google">
            <Button style={{margin: '0px', width: '375px', height: '100%', marginBottom: '5px', background: '#ec4646'}}>
              <GoogleOutlined />
              <Typography.Text>구글 로그인</Typography.Text>
            </Button>
          </a>
          <a href="http://localhost:5000/auth/facebook">
            <Button style={{margin: '0px', width: '375px', height: '100%', marginBottom: '5px', background: '#395693'}}>
              <FacebookOutlined/>
              <Typography.Text>페이스북 로그인</Typography.Text>
            </Button>
          </a>
          <a href="http://localhost:5000/auth/kakao">
            <Button style={{margin: '0px', width: '375px', height: '100%', marginBottom: '5px', background: '#FEDE00'}}>
              <MessageOutlined />
              <Typography.Text strong="true">카카오 로그인</Typography.Text>
            </Button>
          </a>
      </div>
    </div >
  )
}

export default LoginPage
