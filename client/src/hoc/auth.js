/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { auth } from '../_actions/user_actions';
import { useSelector, useDispatch } from "react-redux";

export default function (SpecificComponent, option, adminRoute = null) {
    function AuthenticationCheck(props) {

        let user = useSelector(state => state.user);
        const dispatch = useDispatch();

        useEffect(() => {
            console.log('dispatch(auth())=====')
            //내 현재 상태를 확인하려면 인증 요청을 보내기
            dispatch(auth()).then(response => {//액션 결과를 받음
                console.log('auth action의 결과', response.payload);
                //로그인 되지 않은 상태 
                if (!response.payload.isAuth) {
                    if (option) {
                        //로그인 하지 않았는데 로그인한 사용자만 들어갈 수 있는 
                        //페이지를 들어가려고 할 때
                        props.history.push('/login')
                    }
                } else {//로그인 된상태
                    if (adminRoute && !response.payload.isAdmin) {//관리자만 들어가야되지만 관리자가 아닌 경우
                        props.history.push('/')
                    }
                    else {
                        if (option === false) {//로그인한 사람이 들어갈 수 없는 곳에 들어가려고 할 때
                            props.history.push('/')
                        }
                    }
                }
                
            })
        }, [])

        return (
            <SpecificComponent {...props} user={user} />
        )
    }
    return AuthenticationCheck
}


