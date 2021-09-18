import React, { useState, useEffect } from 'react'
import { Card, message, Col, Modal, Skeleton } from 'antd';
import axios from 'axios';
import { Redirect, useLocation } from "react-router-dom";
import Notfound from '../Notfound';
import Pagination from '../Pagination';
import MyHelmet from '../MyHelmet';
const { Meta } = Card;
export default function AppliedCandidate(props) {
    const [userList, setUserList] = useState([]);
    // const [load, setLoad] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [current, setCurrent] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(props.isLogin);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    useEffect(() => {
        console.log("use effect")
        window.scrollTo({ behavior: 'smooth', top: '0px' });
        if (location.id)
            fetchUsers()
    }, [])
    const fetchUsers = async () => {
        setIsLoading(true);
        const token = "Bearer " + localStorage.getItem("token")
        const URL = process.env.REACT_APP_BACKEND_URL + "users?job_id=" + location.id;
        console.log(URL);
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
    const setItem1 = (index) => {
        setCurrent(index);
        setVisible1(true);
    }
    // const renderUsers = (users) => {
    //     if (users.length === 0) {
    //         return (
    //             <div>
    //                 No One Has Applied to this Job
    //             </div>
    //         )
    //     }
    //     return (
    //         users.map((user, index) => {
    //             return (
    //                 <Col key={index} span="12" >
    //                     <Card onClick={() => setItem1(index)}
    //                         title={user.role} style={{ height: 200 }}
    //                         bordered={true} hoverable>
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
    const userCard = ({ index, data }) => {
        const user = data;
        return (
            <Col key={index} span="12" >
                <Card onClick={() => setItem1(index)}
                    title={user.role} style={{ height: 200 }}
                    bordered={true} hoverable>
                    <Meta
                        title={`Name: ${user.first_name} ${user.last_name}`}
                        description={`Email: ${user.email}`}
                    />
                </Card>
            </Col>
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
                    <Card >
                        <ul>
                            <li>First Name: {user.first_name}</li>
                            <li>Last Name: {user.last_name}</li>
                            <li>City: {user.city}</li>
                            <li>Role: {user.role}</li>
                            {user.role === "Candidate" ? <li>Experience: {user.experience} years</li> : null}
                        </ul>
                    </Card>

                </Modal>
            );
    }
    // if(localStorage.getItem("role") && localStorage.getItem("role")==="Candidate")
    // return <Redirect to="/home"></Redirect>
    if (!location.id)
        return <Notfound />
    if (!isAuthenticated)
        return <Redirect to="/logout"></Redirect>
    return (
        <div>
            <MyHelmet title="Applied candidate" name="List of applied candidate" />{
                isLoading ? <Skeleton /> :
                    <div>
                        <h1>
                            Candidates Applied To Job
                        </h1>
                        {userList.length > 0 ? (
                            <Pagination
                                data={userList}
                                RenderComponent={userCard}
                                pageLimit={2}
                                dataLimit={6} />)
                            : (<h2>  No One Has Applied to this Job</h2>)
                        }
                        {visible1 ? detailModel() : null}
                        {/* <Row gutter={[12, 48]} justify="space-between">
                {renderUsers(userList)}
                {visible1 ? detailModel() : null}
            </Row> */}
                    </div>
            }
        </div>
    )
}
