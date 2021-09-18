import React, { useState, useEffect } from 'react'
import { Card, message, Col, Popconfirm, Button, Drawer, Input, Form, Skeleton, Spin } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import Notfound from '../Notfound';
import Pagination from '../Pagination';
import MyHelmet from '../MyHelmet';
const { Meta } = Card;
export default function Companies(props) {
    const [form] = Form.useForm();
    const [companyList, setcompanyList] = useState([]);
    const [load, setLoad] = useState(false);
    const [visible, setVisible] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(props.isLogin);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteSpin, setisDeleteSpin] = useState(false);
    useEffect(() => {
        console.log("use effect")
        window.scrollTo({ behavior: 'smooth', top: '0px' });
        if (localStorage.getItem("role") === "Admin")
            fetchCompanies()
    }, [load])
    const fetchCompanies = async () => {
        setIsLoading(true);
        const URL = process.env.REACT_APP_BACKEND_URL + "company"
        let response;
        try {
            response = await axios.get(URL, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.status)
            if (response.status === 200) {
                console.log(response.data);
                if (response.data === null)
                    response.data = []
                setcompanyList(response.data);
                setIsLoading(false);
            }

        }
        catch (e) {
            if (e.response && e.response.status === 401) {
                message.warning('Please Login To Continue');
                setIsAuthenticated(false);
                return;
            }
            message.error('Something Went Wrong. Please Try Again!!!!');
            console.log("ERROR", e)
            setIsLoading(false);
        }
    }
    const deleteCompany = async (id) => {
        setisDeleteSpin(true);
        const token = "Bearer " + localStorage.getItem("token")
        const URL = process.env.REACT_APP_BACKEND_URL + "company/" + id;
        try {
            const response = await axios.delete(URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });
            console.log(response.status)
            if (response.status === 200) {
                console.log("deleted successfully");
                message.success('Deleted Sucessfully');
                setisDeleteSpin(false);
                setLoad(!load);
                return;
            }
        }
        catch (e) {
            if (e.response && e.response.status === 401) {
                message.warning('Please Login To Continue');
                setIsAuthenticated(false);
                return;
            }
            message.error('Something Went Wrong. Please Try Again!!!!');
            console.log("ERROR", e);
            setisDeleteSpin(false);
        }
    }
    const addcompany = async (values) => {
        setisDeleteSpin(true);
        const token = "Bearer " + localStorage.getItem("token")
        const URL = process.env.REACT_APP_BACKEND_URL + "company";
        try {
            const response = await axios.post(URL, values, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });
            console.log(response.status)
            if (response.status === 200) {
                console.log("Addes successfully");
                message.success('Added Sucessfully');
                setVisible(!visible)
                setisDeleteSpin(false);
                setLoad(!load);
                form.resetFields();
                return;
            }
        }
        catch (e) {
            if (e.response && e.response.status === 401) {
                message.warning('Please Login To Continue');
                setIsAuthenticated(false);
                return;
            }
            message.error('Something Went Wrong. Please Try Again!!!!');
            console.log("ERROR", e);
            setisDeleteSpin(false);
        }
    }
    // const renderCompanies = (companies) => {
    //     if (companies.length === 0) {
    //         return (
    //             <div>
    //                 <h2>
    //                     No Company Exist In Application...
    //                 </h2>
    //             </div>
    //         )
    //     }
    //     return (
    //         companies.map((company, index) => {
    //             return (
    //                 <Col key={index} span="32" >
    //                     <Card
    //                         title={company.name} style={{ height: 200 }}
    //                         bordered={true} hoverable
    //                         actions={[
    //                             <Popconfirm
    //                                 title="Are you sure to delete this company?"
    //                                 onConfirm={() => deleteCompany(company.id)}
    //                                 okText="Delete"
    //                                 cancelText="No"
    //                             >
    //                                 <DeleteOutlined key="delete" />,
    //                             </Popconfirm>
    //                         ]}
    //                         extra={company.email}>
    //                         <Meta
    //                             title={company.phone_number}
    //                             description={company.address}
    //                         />
    //                     </Card>
    //                 </Col>
    //             );
    //         })
    //     );
    // }
    const companyCard = ({ index, data }) => {
        var company = data;
        return (
            <Col key={index} span="12" >
                <Card
                    title={company.name} style={{ height: 200 }}
                    bordered={true} hoverable
                    actions={[
                        <Popconfirm
                            title="Are you sure to delete this company?"
                            onConfirm={() => deleteCompany(company.id)}
                            okText="Delete"
                            cancelText="No"
                        >
                            <DeleteOutlined key="delete" />,
                        </Popconfirm>
                    ]}
                    extra={company.email}>
                    <Meta
                        title={company.phone_number}
                        description={company.address}
                    />
                </Card>
            </Col>
        );
    }
    const AddCompanyDrawer = () => {
        return (
            <Drawer
                title="Add New Company"
                visible={visible}
                placement="bottom"
                closable={false}
                height="500"
                onClose={() => setVisible(!visible)}
            >
                <Form onFinish={addcompany} form={form}>
                    <Form.Item
                        name="name"
                        label="Company Name"
                        initialValue=""
                        hasFeedback
                        rules={[{ required: true, message: "Please input your company's name!", whitespace: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        hasFeedback
                        rules={[{ required: true, type: "email", message: "Please input your company's mail!", whitespace: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="phone_number"
                        label="Telephone Number"
                        hasFeedback
                        rules={[
                            {
                                required: true, message: "Please input your company's phone number!", whitespace: true
                            },
                            {
                                validator(_, value) {
                                    const pattern = /^[1-9]{1}[0-9]{9}$/;
                                    if (!value || pattern.test(value))
                                        return Promise.resolve();
                                    return Promise.reject("Please enter 10 digit mobile number ")
                                }
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Address"
                        hasFeedback
                        rules={[{ required: true, message: "Please input your company's address!", whitespace: true }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>
        );
    }
    if (localStorage.getItem("role") && localStorage.getItem("role") !== "Admin")
        return <Notfound />
    if (!isAuthenticated)
        return <Redirect to="/logout"></Redirect>
    return (
        <div>
            <MyHelmet title="Companies" name="Details of company" />{
                isLoading ? <Skeleton />
                    :
                    <>
                        <Spin spinning={isDeleteSpin}>
                            <Button type="primary" onClick={() => setVisible(!visible)} >Add Company</Button>
                            <br />
                            <br />
                            <br />
                            {/* <Row gutter={[12, 48]} justify="space-between"> */}
                            {/* {renderCompanies(companyList)} */}
                            {/* </Row> */}
                            {companyList.length > 0 ? (
                                <Pagination
                                    data={companyList}
                                    RenderComponent={companyCard}
                                    pageLimit={2}
                                    dataLimit={6} />)
                                : (<h1>No Company Exist In Application...</h1>)
                            }
                            {AddCompanyDrawer()}
                        </Spin>
                    </>
            }
        </div>
    )
}
