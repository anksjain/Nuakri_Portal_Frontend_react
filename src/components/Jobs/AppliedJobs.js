import React, { useState, useEffect } from 'react'
import { Card, Button, message, Skeleton, Spin } from 'antd';
import axios from 'axios';
import { Redirect, useHistory, useLocation } from "react-router-dom";
import Modal from 'antd/lib/modal/Modal';
import Pagination from '../Pagination';
import MyHelmet from '../MyHelmet';
const { Meta } = Card;
export default function AppliedJobs(props) {
    const location = useLocation();
    const history = useHistory();
    const [jobs, setJobs] = useState([]);
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [company, setCompany] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(props.isLogin);
    const [isSpin, setIsSpin] = useState(false);
    useEffect(() => {
        window.scrollTo({ behavior: 'smooth', top: '0px' });
        fetchJobs()
    }, [])
    const fetchJobs = async () => {
        if (localStorage.getItem("role") === "Recruiter" || (!location.id && localStorage.getItem("role") === "Admin"))
            return history.push("/");
        setIsLoading(true);
        var URI = "type=applied"
        if (location.id)
            URI = "applied=" + location.id
        const token = "Bearer " + localStorage.getItem("token")
        const URL = process.env.REACT_APP_BACKEND_URL + "jobs?" + URI
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
                setJobs(response.data);
                setIsLoading(false)

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
        }
    }
    const fetchCompany = async (id) => {
        setIsSpin(true);
        const token = "Bearer " + localStorage.getItem("token")
        const URL = process.env.REACT_APP_BACKEND_URL + "company/" + id;
        try {
            const response = await axios.get(URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });
            console.log(response.status)
            if (response.status === 200) {
                console.log(response.data);
                setCompany(response.data);
                setVisible(!visible);
                setIsSpin(false);
                console.log("getcompany");
            }
        }
        catch (e) {
            if (e.response && e.response.status === 401) {
                message.warning('Please Login To Continue');
                setIsAuthenticated(false)
                return
            }

            message.error('Something Went Wrong. Please Try Again!!!!');
            console.log("ERROR", e);
            setIsSpin(false);
        }
    }
    // const renderJobs = (jobs) => {
    //     if (jobs.length === 0) {
    //         return (
    //             <div>
    //                 You have not applied to any job....
    //             </div>
    //         )
    //     }
    //     return (
    //         jobs.map((job) => {
    //             return (
    //                 <Card hoverable key={job.id} style={{ width: "100%" }}
    //                     actions={[
    //                         <Button type="primary" onClick={() => fetchCompany(job.company_id)}>Company</Button>,
    //                         ]}>
    //                     <Meta
    //                         title={job.title}
    //                         description={job.description}
    //                     />
    //                 </Card>
    //             );
    //         })
    //     );
    // }
    const jobCard = ({ data }) => {
        const job = data;
        return (
            <Card hoverable key={job.id} style={{ width: "100%" }}
                actions={[
                    <Button type="primary" onClick={() => fetchCompany(job.company_id)}>Company</Button>,
                ]}>
                <Meta
                    title={job.title}
                    description={job.description}
                />
            </Card>
        );
    }
    const companyDetailModel = () => {
        if (company)
            return (
                <Modal
                    title="Company Info"
                    visible={visible}
                    onOk={() => setVisible(!visible)}
                    onCancel={() => setVisible(!visible)}
                >
                    <Card >
                        <ul>
                            <li>Company Name: {company.name}</li>
                            <li>Mail: {company.email}</li>
                            <li>Address: {company.address}</li>
                            <li>Number: {company.phone_number}</li></ul>
                    </Card>

                </Modal>
            );
    }
    if (!isAuthenticated)
        return <Redirect to="/logout"></Redirect>
    return (
        <div>
            <MyHelmet title="Applied Jobs" name="Applied jobs by candidate" />{
                isLoading ?
                    <Skeleton></Skeleton>
                    :
                    <div>
                        <Spin spinning={isSpin}>
                            <h1>List of Jobs</h1>
                            {jobs.length > 0 ? (
                                <Pagination
                                    data={jobs}
                                    RenderComponent={jobCard}
                                    pageLimit={2}
                                    dataLimit={6} />)
                                : (<h2>  You have not applied to any job....</h2>)
                            }
                            {companyDetailModel()}
                            {/* <Row gutter={[2, 48]}>
                            {renderJobs(jobs)}
                            {companyDetailModel()}
                        </Row> */}
                        </Spin>
                    </div>
            }
        </div>
    )
}
