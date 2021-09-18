import React, { Component } from 'react'
import { Layout, Menu } from 'antd';
import { Link, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login from './Auth.js/Login';
import Register from './Auth.js/Register';
import Jobs from './Jobs/Jobs';
import Logout from './Auth.js/Logout';
import PostJob from './Jobs/PostJob';
import UserList from './Users/UserList';
import Companies from './Company/Companies';
import './App.css';
import AppliedJobs from './Jobs/AppliedJobs';
import AppliedCandidate from './Users/AppliedCandidate';
import AdminLogin from './Auth.js/AdminLogin';
import Notfound from './Notfound';
const { Header, Content, Footer } = Layout;
class MyLayout extends Component {
    state = {
        email: localStorage.getItem("email"),
        isLogin: localStorage.getItem("isLogin") ? true : false,
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role"),
        collapsed: true
    };
    loginHandler = (email, isLogin, token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('isLogin', true);
        localStorage.setItem('email', email);
        localStorage.setItem('role', role)
        this.setState({
            email,
            isLogin,
            token,
            role
        })
    }
    onCollapse = collapsed => {
        this.setState({ collapsed });
    };
    onLogout = () => {
        localStorage.clear()
        this.setState({
            email: "",
            token: "",
            isLogin: false,
            role: ""
        })
    }
    render() {
        console.log("From Class render", this.state.isLogin)
        return (
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <div className="logo" />
                    <Menu theme="dark" mode="horizontal">
                        <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                        {this.RoleHeaders()}
                        {this.Headers()}

                    </Menu>
                </Header>
                <Content className="site-layout" style={{ padding: '0 50px ', marginTop: 64, overflow: "auto", height: "100vh" }}>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 380 }}>
                       <Switch>
                        <Route path="/" exact component={() => <Home />} />
                        <Route path="/register" exact  component={() => <Register />} />
                        <Route path="/login" exact component={() => <Login isLogin={this.state.isLogin} loginHandler={this.loginHandler}></Login>} />
                        <Route path="/admin-login" exact component={() => <AdminLogin isLogin={this.state.isLogin} loginHandler={this.loginHandler}></AdminLogin>} />
                        <Route path="/logout" exact component={() => <Logout isLogin={this.state.isLogin} onLogout={this.onLogout}></Logout>} />
                        <Route path="/jobs" exact component={() => <Jobs isLogin={this.state.isLogin}></Jobs>} />
                        <Route path="/appliedjob" exact component={() => <AppliedJobs isLogin={this.state.isLogin}></AppliedJobs>} />
                        <Route path="/postjob" exact component={() => <PostJob isLogin={this.state.isLogin}></PostJob>} />
                        <Route path="/users" exact component={() => <UserList isLogin={this.state.isLogin}></UserList>} />
                        <Route path="/companies" exact component={() => <Companies isLogin={this.state.isLogin}></Companies>} />
                        <Route path="/candidate" exact component={() => <AppliedCandidate isLogin={this.state.isLogin}></AppliedCandidate>} />
                        <Route component={() => <Notfound/>} /> 
                        </Switch>
                       
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Naukri Portal ©2021 Created by SB</Footer>
            </Layout>
        )
    }
    Headers() {
        if (this.state.isLogin) {
            return (
                <>
                    <Menu.Item key="5"><Link to="/jobs">Jobs</Link></Menu.Item>
                    <Menu.Item key="4"><Link to="/logout">Logout</Link></Menu.Item>
                </>
            );
        }
        else {
            return (
                <>
                    <Menu.Item key="2"><Link to="/login">Login</Link></Menu.Item>
                    <Menu.Item key="3"><Link to="/register">Sign Up</Link></Menu.Item>
                </>);
        }

    }

    RoleHeaders() {
        if (this.state.isLogin) {
            if (localStorage.getItem("role") === "Candidate") {
               return(
               <>
                    <Menu.Item key="9"><Link to="/appliedjob">Applied Jobs</Link></Menu.Item>
                </>);
            }
            if (localStorage.getItem("role") === "Recruiter") {
                return (
                    <>
                        <Menu.Item key="6"><Link to="/postjob">Post Job</Link></Menu.Item>
                    </>
                );
            }
            if (localStorage.getItem("role") === "Admin") {
                return (
                    <>
                        <Menu.Item key="7"><Link to="/users">Users</Link></Menu.Item>
                        <Menu.Item key="8"><Link to="/companies">Company</Link></Menu.Item>
                    </>
                );
            }

        }
    };
}
export default MyLayout;