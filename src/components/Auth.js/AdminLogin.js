import React, { useState } from 'react'
import { Form, Input, Button, Checkbox, Row, message, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import MyHelmet from '../MyHelmet';
export default function AdminLogin(props) {
  // const [isAuthenticated, setIsAuthenticated] = useState(props.isLogin);
  const [isSpin, setIsSpin] = useState(false);
  const onFinish = async (values) => {
    console.log(isSpin);
    setIsSpin(true);
    const data = {
      email: values.email,
      password: values.password
    };
    const URL = process.env.REACT_APP_BACKEND_URL + "login"
    try {
      const response = await axios.post(URL, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        const user = jwtDecode(response.data.token)
        if(user.Role!=="Admin")
        {
            message.warning('Please check credentials!!!');
            setIsSpin(false);
            return
        }
        message.success('Login Successfully');
        props.loginHandler(data.email, true, response.data.token, user.Role);
        setIsSpin(false);
      }
    }
    catch (e) {
      if (e.response && e.response.status === 400) {
        message.warning('Please check credentials!!!');
        setIsSpin(false);
        return
      }
      message.error('Something Went Wrong. Please Try Again!!!!');
      console.log("error", e)
      setIsSpin(false);
    }
  };
  const loginForm = () => {
    return (
      <Row justify='space-between'>
        <Form
          name="normal_login"
          className="login-form"
          layout="vertical"
          size="large"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: 'Please input your Email!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email Address" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"

            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form.Item>

            <Spin spinning={isSpin}>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            <br></br>
            <br></br>
            Or <Link to="/register">Register Now!</Link>
          </Form.Item>
            </Spin>
        </Form>
      </Row>

    );
  }
  if (props.isLogin) {
    return <Redirect to="/jobs" />
  }
  console.log("Login Component Started")
  return (
    <div>
      <MyHelmet title="Admin Login" name="Login For Admins"/>
      <h1>Login Here</h1>
      {loginForm()}
    </div>
  );
}
