import { Divider, PageHeader } from 'antd';
import MyHelmet from './MyHelmet';
export default function Home() {
    console.log("Home")
    return (
        <div>
            <MyHelmet title="Home Page" name="Dashboard"/>
            <h1>Welcome to Home Page</h1>
            <PageHeader
                title="Job Portal"
            />
            <>
                <p>
                    Job websites act as both search engines and databases for open jobs. Some even offer premium services for job seekers like career coaching and cover letter writing. Job sites can help candidates with any education and experience level find employment in any sector.
                    Anyone actively looking for a job should strongly consider using a job website in order to find and apply to as many relevant opportunities as possible. </p>
                <Divider plain></Divider>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
                    probare, quae sunt a te dicta? Refert tamen, quo modo.
                </p>
                <Divider orientation="left" plain>
                </Divider>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
                    probare, quae sunt a te dicta? Refert tamen, quo modo.
                </p>
                <Divider orientation="right" plain>
                </Divider>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista
                    probare, quae sunt a te dicta? Refert tamen, quo modo.
                </p>
            </>
        </div>
    )
}
