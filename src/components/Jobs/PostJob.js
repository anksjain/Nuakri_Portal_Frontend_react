import React, { useState } from 'react'
import {  Button, message, Row, Spin } from 'antd';
import { Form, Input } from 'antd';
import axios from 'axios';
import { Redirect ,useHistory} from 'react-router-dom';
import Notfound from '../Notfound';
import MyHelmet from '../MyHelmet';
export default function PostJob(props) {
    const history=useHistory();
    const [isAuthenticated, setIsAuthenticated] = useState(props.isLogin);
    const [isPosted, setisPosted] = useState(false);


    
    const postJob = async (values) => {
        setisPosted(true);
        const data = {
            title: values.title,
            description: values.description
          };
        const token = "Bearer " + localStorage.getItem("token")
        const URL = process.env.REACT_APP_BACKEND_URL + "jobs"
        let response;
        try {
            response = await axios.post(URL, data,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });
            console.log(response.status)
            if (response.status === 200) {
                console.log(response.data);
                message.success('Job Posted Successfully');
                return history.push("/jobs");
            }

        }
        catch (e) {
            if (e.response.status===401) {
                message.warning('Please Login To Continue');
                setIsAuthenticated(false)
                return
            }

            message.error('Something Went Wrong. Please Try Again!!!!');
            console.log("ERROR", e)
            setisPosted(false);
        }
    }
    if (!isAuthenticated)
        return <Redirect to="/logout"></Redirect>
    if(localStorage.getItem("role")==="Candidate" || localStorage.getItem("role")==="Admin")
        return <Notfound/>
    return (
        <div>
            <MyHelmet title="Post Job " name="Add New Job"/>
            <h1>Add New Job</h1>
        <Row justify="start">
        <Form  
        size="large"
        onFinish={postJob}
        name="post_job">
            <Form.Item
            label="Job Title"
                name="title"
                rules={[
                    {
                        required: true,
                        min:5,
                        max:30,
                        type:'string',
                        message: 'Should be min 5 characters & max 15 characters!',
                    },
                ]} >
                <Input placeholder="Enter Job Title"  />
            </Form.Item>
            <Form.Item
                name="description"
                label="Job Description"
                rules={[
                    {
                        required: true,
                        min:5,
                        max:30,
                        type:'string',
                        message: 'Should be min 5 characters & max 30 characters!',
                    },
                ]} >
                <Input.TextArea placeholder="Enter Job Description"  />
            </Form.Item>
            <Spin spinning={isPosted}>
            <Form.Item
            >
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
            </Spin>
        </Form>
        </Row>
        </div>
    )
}
