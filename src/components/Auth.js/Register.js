import {
    Form,
    Select,
    Switch,
    Input,
    Button,
    InputNumber,
    message,
    Skeleton,
    Spin,
} from 'antd';
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import MyHelmet from '../MyHelmet';
const { Option } = Select;
export default function Register() {
    const history = useHistory()
    const [isSpin, setIsSpin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [companies, setCompanies] = useState([])
    const [isRecruiter, setisRecruiter] = useState(false)

    useEffect(() => {
        console.log("useffect-Register");
        window.scrollTo({ behavior: 'smooth', top: '0px' });
        fetchCompanies();
    }, [])
    const fetchCompanies = async () => {
        const URL = process.env.REACT_APP_BACKEND_URL + "company"
        console.log(URL,"URL")
        let response;
        try {
            response = await axios.get(URL, {
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            console.log(response.status)
            if (response.status === 200) {
                console.log(response.data);
                setCompanies(response.data)
                setIsLoading(false);
                return
            }
        }
        catch (e) {
            message.error('Something Went Wrong. Please Try Again!!!!');
            console.log("ERROR", e)
            // return history.push("/home")
        }
    }
    const renderCompanies = (companies) => {
        if (companies.length === 0)
            return null;
        return companies.map((company) => {
            return (
                <Option key={company.id} value={company.id}>{company.name}</Option>
            );
        })
    }
    const onSubmit = async (values) => {
        setIsSpin(true);
        const data = {
            email: values.email,
            password: values.password,
            last_name: values.lastname,
            first_name: values.firstname,
            role: isRecruiter ? "Recruiter" : "Candidate",
            company_id: isRecruiter ? values.company : 0,
            experience: isRecruiter ? 0 : values.experience,
            city: values.city
        };
        console.log(data);
        const URL = process.env.REACT_APP_BACKEND_URL + "register"
        try {
            const response = await axios.post(URL, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                console.log(response.data);
                message.success('Registered Successfully');
                return history.push("/login")

            }
        }
        catch (e) {
            if (e.response && e.response.status === 302) {
                message.warning('Email Already Exist!!!!');
                setIsSpin(false);
                return
            }
            message.error('Something Went Wrong. Please Try Again!!!!');
            console.log("error", e)
            setIsSpin(false);
            return;
        }
    };
    console.log("Register")
    const registerFormLayout = () => {
        const formItemLayout = {
            labelCol: {
                span: 24,
            },
            wrapperCol: {
                span: 10,
            },
        };
        return (
            <Spin spinning={isSpin}>
                <Form {...formItemLayout}
                    onFinish={onSubmit}
                    layout="vertical"
                    scrollToFirstError>
                    <Form.Item
                        name="firstname"
                        label="First Name"
                        hasFeedback
                        tooltip="What do you want others to call you?"
                        rules={[{
                            required: true, type: "regexp",
                            pattern: new RegExp(/^[A-Za-z]+$/), message: 'Please input your first name!', whitespace: true
                        }]}
                    >
                        <Input />
                    </Form.Item><Form.Item
                        name="lastname"
                        label="Last Name"
                        hasFeedback
                        tooltip="What's your last name?"
                        rules={[{ required: true, message: 'Please input your last name!', whitespace: false }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="E-mail"
                        hasFeedback
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="city"
                        label="City"
                        hasFeedback
                        tooltip="Where is your residence?"
                        placeholder="Enter Your Current City Name"
                        rules={[{ required: true, message: 'Please Enter City', whitespace: false }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        tooltip="Conatinas atleast one alphabet and number"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                            {
                                validator(_, value) {
                                    const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
                                    if (!value || pattern.test(value.toString()))
                                        return Promise.resolve();
                                    return Promise.reject("Should contain atleast 6 characters with one alphabet & one number");
                                }
                            }
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="switch" valuePropName="checked" label={"Switch For " + (isRecruiter ? "Candidate" : "Recruiter")} >
                        <Switch onClick={() => setisRecruiter(!isRecruiter)} />
                    </Form.Item>
                    {
                        !isRecruiter
                            ? <>
                                <Form.Item
                                    name="experience"
                                    label="Experience"
                                    rules={[
                                        {
                                            required: true,
                                            type: 'number',
                                            min: 0,
                                            max: 15,
                                            message: "Should be between 0 to 15 years"
                                        },
                                    ]}
                                ><InputNumber /></Form.Item>
                            </>
                            : <>
                                <Form.Item
                                    name="company"
                                    label="Select Company"
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select your company!',
                                        },
                                    ]}
                                >
                                    <Select placeholder="Please select a company">
                                        {renderCompanies(companies)}
                                    </Select>
                                </Form.Item>
                            </>
                    }

                    <Form.Item
                    >
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                        <div></div>
                        Already Have account?  <Link to="/login">Login now!</Link>
                    </Form.Item>
                </Form>
            </Spin>

        );
    }
    return (
        <div>
            <MyHelmet title="Register" name="Register For Users" />{
                isLoading ? <Skeleton></Skeleton>
                    :
                    <>
                        <h1>Register Here To Boost Your Carrer</h1>
                        {registerFormLayout()}
                    </>
            }
        </div>
    )

}
