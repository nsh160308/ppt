import React, { useEffect, useState } from 'react'
import Axios from 'axios';

function Subscribe(props) {

    

    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        
        //console.log(props.userTo);

        let variable = { userTo: props.userTo }
        
        //해당 비디오를 올린 유저가 몇명의 구독자를 가지고 있는지
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if(response.data.success) {
                    //console.log(response.data);
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('구독자 수를 받아오지 못했다.')
                }
            })

        let subscribedVariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }

        //내가 현재 비디오를 올린 유저를 구독하고 있는지
        Axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response => {
                if(response.data.success) {
                    //console.log(response.data);
                    setSubscribed(response.data.subscribed)

                } else {
                    alert("내가 구독한 정보를 가져오지 못했습니다.");
                }
            })

    }, [])

    const onSubscribeHandler = () => {

        let subscribeVariable = {
            userTo: props.userTo,
            userFrom: localStorage.getItem('userId')
        }

        //이미 구독중이라면
        if(Subscribed) {
            //여기서 추가할 기능(모달로 한번 물어보기)

            Axios.post('/api/subscribe/unSubscribe', subscribeVariable)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)

                    } else {
                        alert('구독 취소 실패')
                    }
                })

        //아직 구동중이 아니라면
        } else {
            console.log('구독중이 아닙니다.');

            Axios.post('/api/subscribe/subscribe', subscribeVariable)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독 실패')
                    }
                })

        }
    }

    return (
        <div>
            <button
                style={{
                    backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius: '4px', border: '0px',
                    color: 'white', padding: '10px 16px',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
                }}
                onClick={onSubscribeHandler}
            >
                {SubscribeNumber} {Subscribed ? '구독중' : '구독'}
            </button>
        </div>
    )
}

export default Subscribe
