import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import Axios from 'axios';

const GoogleLoginTest = () => {

    const GoogleLoginTrigger = (response) => {

        let body = {
            token : response.tokenId
        }

        Axios.post("/api/oAuth/google", body)
            .then(res => {
                if(res.data.loginSuccess) {

                } else {
                    alert('실패')
                }
            })
    }

    const GoogleLoginFailed = (err) => {
        console.error(err)
    }

    return (
        <GoogleLogin
            clientId="500787740443-t7ce1tevonk9ndlrssvh1957ajq9kodr.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={GoogleLoginTrigger}
            onFailure={GoogleLoginFailed}
            cookiePolicy={'single_host_origin'}
        />
    )
}

export default GoogleLoginTest
