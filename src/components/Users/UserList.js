import React, { useState, useEffect } from 'react'
import { Card, Button, message, Col, Modal, Input, Form, InputNumber, Popconfirm, Skeleton, Spin } from 'antd';
import { EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Redirect, useHistory } from "react-router-dom";
import Notfound from '../Notfound';
import Pagination from '../Pagination';
import MyHelmet from '../MyHelmet';
const { Meta } = Card;
export default function UserList(props) {
    const history = useHistory();
    const [userList, setUserList] = useState([]);
    const [load, setLoad] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [current, setCurrent] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(props.isLogin);
    const [isLoading, setIsLoading] = useState(true);
    const [isSpin, setIsSpin] = useState(false);
    useEffect(() => {
        console.log("use effect")
        window.scrollTo({ behavior: 'smooth', top: '0px' });
        if (localStorage.getItem("role") === "Admin")
            fetchUsers()
    }, [load])
    const fetchUsers = async () => {
        setIsLoading(true);
        const token = "Bearer " + localStorage.getItem("token")
        const URL = process.env.REACT_APP_BACKEND_URL + "users"
        let response;
        try {
            response = await axios.get(URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });
            console.log(response.status)
            if (response.status === 200) {
                console.log(response.data);
                if (response.data === null)
                    response.data = []
                setUserList(response.data);
                setIsLoading(false);
            }

        }
        catch (e) {
            if (e.response && e.response.status === 401) {
                message.warning('Please Login To Continue');
                setIsAuthenticated(false)
                return
            }
            message.error('Something Went Wrong. Please Try Again!!!!');
            console.log("ERROR", e)
            setIsLoading(false);
        }
    }
    const updateUser = async (values) => {
        setIsSpin(true);
        const token = "Bearer " + localStorage.getItem("token")
        const URL = process.env.REACT_APP_BACKEND_URL + "users/" + values.id;
        try {
            const response = await axios.put(URL, values, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });
            console.log(response.status)
            if (response.status === 200) {
                message.success('Updated Sucessfully');
                setLoad(!load)
                setVisible(!visible);
                setIsSpin(false);
                return

            }
        }
        catch (e) {
            if (e.response && e.response.status === 401) {
                message.warning('Please Login To Continue');
                setIsAuthenticated(false)
                return
            }

            message.error('Something Went Wrong. Please Try Again!!!!');
            console.log("ERROR", e)
            setIsSpin(false);
        }
    }
    const deleteUser = async (id, email) => {
        const currentEmail = localStorage.getItem("email")
        if (currentEmail && currentEmail === email) {
            message.warning("Can't delete your own profile !!!!");
            return;
        }
        setIsSpin(true);
        const token = "Bearer " + localStorage.getItem("token")
        const URL = process.env.REACT_APP_BACKEND_URL + "users/" + id;
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
                setLoad(!load);
                setIsSpin(false);
                return
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
            setIsSpin(false);
        }
    }
    // const renderUsers = (users) => {
    //     if (users.length === 0) {
    //         return (
    //             <div>
    //                 No Users exist
    //             </div>
    //         )
    //     }
    //     const setItem = (index) => {
    //         setCurrent(index);
    //         setVisible(true);
    //     }
    //     const setItem1 = (index) => {
    //         setCurrent(index);
    //         setVisible1(true);
    //     }
    //     return (
    //         users.map((user, index) => {
    //             return (
    //                 <Col key={index} span="12" >
    //                     <Card
    //                         title={user.role} style={{ height: 200 }}
    //                         bordered={true} hoverable
    //                         actions={[
    //                             <Popconfirm
    //                                 title="Are you sure to delete this user?"
    //                                 onConfirm={() => deleteUser(user.id, user.email)}
    //                                 okText="Yes"
    //                                 cancelText="No"
    //                             >
    //                                 <DeleteOutlined key="delete" />
    //                             </Popconfirm>,
    //                             <EditOutlined key="edit" onClick={() => setItem(index)} />,
    //                             <EyeOutlined key="ellipsis" onClick={() => setItem1(index)} />,
    //                         ]}>
    //                         <Meta
    //                             title={`Name: ${user.first_name} ${user.last_name}`}
    //                             description={`Email: ${user.email}`}
    //                         />
    //                     </Card>
    //                 </Col>
    //             );
    //         })
    //     );
    // }
    const setItem = (index) => {
        setCurrent(index);
        setVisible(true);
    }
    const setItem1 = (index) => {
        setCurrent(index);
        setVisible1(true);
    }
    const userCard = ({ index, data }) => {
        const user = data;
        return (
            <Col key={index} span="12" >
                <Card
                    title={user.role} style={{ height: 200 }}
                    bordered={true} hoverable
                    actions={[
                        <Popconfirm
                            title="Are you sure to delete this user?"
                            onConfirm={() => deleteUser(user.id, user.email)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined key="delete" />
                        </Popconfirm>,
                        <EditOutlined key="edit" onClick={() => setItem(index)} />,
                        <EyeOutlined key="ellipsis" onClick={() => setItem1(index)} />,
                    ]}>
                    <Meta
                        title={`Name: ${user.first_name} ${user.last_name}`}
                        description={`Email: ${user.email}`}
                    />
                </Card>
            </Col>
        );
    }
    const updateModal = () => {
        const user = userList[current];
        if (user)
            return (
                <Modal
                    title="Title"
                    visible={visible}
                    onCancel={() => setVisible(!visible)}
                    footer={null}
                >
                    <Form onFinish={updateUser} >

                        <Form.Item
                            name="id"
                            initialValue={user.id}

                            hidden
                        ><input></input></Form.Item>
                        <Form.Item
                            name="first_name"
                            label="First Name"
                            initialValue={user.first_name}
                            hasFeedback
                            rules={[{ required: true, message: 'Please input your first name!', whitespace: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="last_name"
                            label="Last Name"
                            hasFeedback
                            initialValue={user.last_name}
                            rules={[{ required: true, message: 'Please input your last name!', whitespace: false }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="city"
                            label="City"
                            hasFeedback
                            initialValue={user.city}
                            tooltip="Where is your residence?"
                            placeholder="Enter Your Current City Name"
                            rules={[{ required: true, message: 'Please Enter City', whitespace: false }]}
                        >
                            <Input />
                        </Form.Item>
                        {user.role === "Candidate" ?
                            <>
                                <Form.Item
                                    name="experience"
                                    label="Experience"
                                    initialValue={user.experience}
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
                            : null}
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Update
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            );
    }
    const detailModel = () => {
        const user = userList[current];
        if (user)
            return (
                <Modal
                    title="User info"
                    visible={visible1}
                    onOk={() => setVisible1(!visible1)}
                    onCancel={() => setVisible1(!visible1)}
                >
                    <Card  >
                        <ul>
                            <li>First Name: {user.first_name}</li>
                            <li>Last Name: {user.last_name}</li>
                            <li>City: {user.city}</li>
                            <li>Role: {user.role}</li>
                            {user.role === "Candidate" ? <li>Experience: {user.experience} years</li> : null}
                            <br />
                            {user.role === "Candidate" ? <Button type="primary" onClick={() => history.push({
                                pathname: '/appliedjob',
                                id: user.id
                            })}>Applied Jobs</Button> : null}
                        </ul>

                    </Card>

                </Modal>
            );
    }
    console.log(current)
    if (localStorage.getItem("role") && localStorage.getItem("role") !== "Admin")
        return <Notfound />
    if (!isAuthenticated)
        return <Redirect to="/logout"></Redirect>
    return (
        <div>
            <MyHelmet title="Users " name="List of Users" />{
                isLoading ? <Skeleton /> :
                    <div>
                        <Spin spinning={isSpin}>
                            <h1>
                                Users List In Application
                            </h1>
                            {userList.length > 0 ? (
                                <Pagination
                                    data={userList}
                                    RenderComponent={userCard}
                                    pageLimit={2}
                                    dataLimit={6} />)
                                : (<h2>No Users To Show ....</h2>)
                            }
                            {visible ? updateModal() : null}
                            {visible1 ? detailModel() : null}
                            {/* <Row gutter={[12, 48]} justify="space-between">
                        {renderUsers(userList)}
                        {visible ? updateModal() : null}
                        {visible1 ? detailModel() : null}
                    </Row> */}
                        </Spin>
                    </div>
            }
        </div>
    )
}
