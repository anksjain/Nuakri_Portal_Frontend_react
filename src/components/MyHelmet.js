import React from 'react'
import { Helmet } from "react-helmet";
export default function MyHelmet(props) {
    const {title,name}=props;
    return (
        <div>
            <Helmet> <title>{title}</title>
                <meta name={name} content="Lorem ipsum dolor sit amet" />
            </Helmet>
        </div>
    )
}
