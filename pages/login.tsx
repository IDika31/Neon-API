import React from 'react';

export interface Props {
    title: string;
    // csrfToken: string;
}

export default class Login extends React.Component<Props> {
    render() {
        return (
            <form action="/api/v1/login" method='POST'>
                <h1>{this.props.title}</h1>
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                {/* <input type="hidden" name="_csrf" value={this.props.csrfToken}/> */}
                <button type="submit">Login</button>
            </form>
        )
    }
}