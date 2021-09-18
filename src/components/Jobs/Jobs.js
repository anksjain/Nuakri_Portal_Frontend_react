import React, { useState, useEffect } from 'react'
import { Card, Button, message, Skeleton, Spin, Popconfirm } from 'antd';
import axios from 'axios';
import { Redirect, useHistory } from "react-router-dom";
import Modal from 'antd/lib/modal/Modal';
import Pagination from '../Pagination';
import MyHelmet from '../MyHelmet';
const { Meta } = Card;
export default function Jobs(props) {
    const history = useHistory();
    const [jobs, setJobs] = useState([]);
    // const [jobClick, setJobClick] = useState([]);
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [company, setCompany] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(props.isLogin);
    const [isSpin, setIsSpin] = useState(false);
    const [load, setLoad] = useState(false);
    useEffect(() => {
        window.scrollTo({ behavior: 'smooth', top: '0px' });
        fetchJobs()
    }, [load])
    const fetchJobs = async () => {
        setIsLoading(true);
        const token = "Bearer " + localStorage.getItem("token")
        const URL = process.env.REACT_APP_BACKEND_URL + "jobs"
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
                // setJobClick(new Array(response.data.length).fill(false))
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
    const applyJob = async (id, index) => {
        setIsSpin(true);
        const token = "Bearer " + localStorage.getItem("token")
        const URL = process.env.REACT_APP_BACKEND_URL + "jobs/" + id;
        try {
            const response = await axios.post(URL, "", {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });
            console.log(response.status)
            if (response.status === 200) {
                console.log("jobClick");

                message.success('Applied Sucessfully');
                // let applyArray = [...jobClick]
                // applyArray[index] = true;
                setLoad(!load);
                setIsSpin(false);
                // setJobClick(applyArray);
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
    const deletJob = async (id, index) => {
        setIsSpin(true);
        const token = "Bearer " + localStorage.getItem("token")
        const URL = process.env.REACT_APP_BACKEND_URL + "jobs/" + id;
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
                // let applyArray = [...jobClick]
                // applyArray[index] = true;
                setLoad(!load);
                setIsSpin(false);
                // setJobClick(applyArray);
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
    //                 No Jobs To Show....
    //             </div>
    //         )
    //     }
    //     return (
    //         jobs.map((job, index) => {
    //             return (
    //                 <Card
    //                     hoverable key={job.id} style={{ width: "100%" }}
    //                     actions={[
    //                         <Button type="primary" onClick={() => fetchCompany(job.company_id)}>Company</Button>,
    //                         localStorage.getItem("role") === "Candidate" ?
    //                             <Button color="green" type="primary" disabled={jobClick[index]} onClick={() => applyJob(job.id, index)}>{jobClick[index] ? "Applied" : "Apply"}</Button>
    //                             :
    //                             actions(job.id, index)


    //                     ]}>
    //                     <Meta
    //                         title={job.title}
    //                         description={job.description}></Meta>
    //                 </Card>
    //             );
    //         })
    //     );
    // }
    const jobCard = ({ index, data }) => {
        var job = data;
        return (
            <Card
                hoverable key={job.id} style={{ width: "100%" }}
                actions={[
                    <Button type="primary" onClick={() => fetchCompany(job.company_id)}>Company</Button>,
                    localStorage.getItem("role") === "Candidate" ?
                        <Button color="green" type="primary"
                            onClick={() => applyJob(job.id, index)}
                        >
                            Apply
                            {/* {jobClick[index] ? "Applied" : "Apply"} */}
                        </Button>
                        :
                        actions(job.id, index)


                ]}>
                <Meta
                    title={job.title}
                    description={job.description}></Meta>
            </Card>
        );
    }
    const actions = (job_id, index) => {
        return (
            <>
                <Popconfirm
                    title="Are you sure to delete this user?"
                    onConfirm={() => deletJob(job_id, index)}
                    okText="Yes"
                    cancelText="No">
                    <Button color="red" type="primary" danger={true}
                    // disabled={jobClick[index]}
                    >
                        Delete
                        {/* {jobClick[index] ? "Deleted" : "Delete"} */}
                    </Button>

                </Popconfirm>
                <Button type="primary" onClick={() => history.push({
                    pathname: '/candidate',
                    id: job_id
                })}>Candidates</Button>
            </>
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
            <MyHelmet title="Jobs" name="List of Jobs" />{
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
                                : (<h2>No Jobs To Show ....</h2>)
                            }
                            {/* <Row gutter={[2, 48]}>
                    <Pagination 
                        data={Jobs}
                        RenderComponent={jobCard}
                        pageLimit={3}
                        dataLimit={6}/>
                        {renderJobs(jobs)}
                        {companyDetailModel()}
                    </Row> */}
                            {companyDetailModel()}
                        </Spin>
                    </div>
            }
        </div>
    )
}
