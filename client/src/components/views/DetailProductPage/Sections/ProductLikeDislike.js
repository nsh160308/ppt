import React, { useEffect, useState } from 'react'
import { Tooltip, Icon, Typography } from 'antd';
import Axios from 'axios';

const { Text } = Typography


function ProductLikeDislike(props) {
    //좋아요 상태를 관리합니다.
    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)

    //싫어요 상태를 관리합니다.
    const [DisLikes, setDisLikes] = useState(0)
    const [DisLikeAction, setDisLikeAction] = useState(null)

    //localStorage에 저장된 userId를 가져옵니다.
    const userId = localStorage.getItem('userId');
    //받아온 productId를 저장합니다.
    const productId = props.productId && props.productId;
    //받아온 productCommentId를 저장합니다.
    const productCommentId = props.productCommentId;
    

    //console.log('상품 고유번호', productId);

    //console.log('댓글 고유번호', props.productCommentId);

    /**
     * useEffect로 좋아요 수를 가져올 때, 
     * 상품(product)과 상품 댓글(productComment)을
     * 분리하기 위해 productInfo에서 product란 prop을 줍니다.
     * 만약, product prop이 있다면 그 컴포넌트는 상품의 좋아요 수를 가져오고
     * prop이 없다면 상품 댓글의 좋아요 수를 가져옵니다.
     * 상품의 좋아요 수를 가져올 때는 userId는 필요가없지만
     * 로그인한 사용자가 좋아요, 싫어요를 누를 때, 사용자의 _id를 보내줄 필요가 있기 때문이다.
     */
    let variable = {};
        
    if(props.product) {
        variable = { 
            userId: userId,
            productId: productId
        }
    } else {
        variable = {
            userId: userId,
            productCommentId: productCommentId,
        }
    }
    
    useEffect(() => {
        //좋아요 가져오기
        Axios.post('/api/productLD/getLikes', variable)
            .then(result => {
                if(result.data.success) {
                    //console.log('얼마나 많은 좋아요를 가져오는지', result.data);
                    /**
                     * 얼마나 많은 좋아요를 받았는지 확인하고
                     * 만약 로그인한 사용자가 이미 해당 상품에 좋아요를 줬다면
                     * 액션 상태를 변경합니다.
                     */
                    setLikes(result.data.likes.length)

                    result.data.likes.map(like => {
                        console.log(userId)
                        if(like.userId === userId) {
                            console.log('true')
                            setLikeAction('liked')
                        }
                    })
                } else {
                    alert("모든 좋아요 수를 가져오는데 실패 했습니다.");
                }
            })
        //싫어요 가져오기
        Axios.post('/api/productLD/getDisLikes', variable)
            .then(result => {
                if(result.data.success) {
                    //console.log('상품과 상품리뷰의 싫어요 정보', result.data)
                    /**
                     * 얼마나 많은 싫어요를 받았는지 확인하고
                     * 만약 로그인한 사용자가 이미 해당 상품에 싫어요를 줬다면
                     * 액션 상태를 변경합니다.
                     */
                    setDisLikes(result.data.disLikes.length)

                    result.data.disLikes.map(dislike => {
                        if(dislike._id === userId) {
                            setDisLikeAction('disliked')
                        }
                    })
                }
            })
    }, [])

    //좋아요 핸들링
    const onLikeHandler = () => {
        //좋아요 클릭하지 않은 상태일 때,
        if(LikeAction === null) {
            Axios.post('/api/productLD/upLike', variable)
                .then(result => {
                    if(result.data.success) {
                        console.log('4',result.data)
                        /**
                         * 정상적으로 좋아요를 누르는데 성공했고,
                         * 싫어요를 누른 상태였다면 싫어요 정보도 삭제됐다.
                         * 남은 일은 좋아요를 1증가 시키고
                         * 좋아요를 누른 상태로 변경 시키고
                         * 싫어요를 누른 상태였다면 싫어요를 1감소 시키고
                         * 싫어요를 누르지 않은 상태로 변경시킨다.
                         */
                        setLikes(Likes + 1)
                        setLikeAction('liked')

                        if(DisLikeAction !== null) {
                            setDisLikes(DisLikes -1)
                            setDisLikeAction(null)
                        }
                    } else {
                        alert("좋아요를 누르지 못했습니다.");
                    }
                })
        //좋아요를 클릭한 상태일 때,
        } else {
            Axios.post('/api/productLD/downLike', variable)
                .then(result => {
                    if(result.data.success) {
                        /**
                         * 정상적으로 좋아요를 취소하는데 성공했고,
                         * 좋아요를 1감소 시키고
                         * 좋아요 상태를 변경합니다.
                         */
                        setLikes(Likes -1)
                        setLikeAction(null)
                    } else {
                        alert("좋아요를 취소하는데 실패 했습니다.")
                    }
                })
        }
    }

    //싫어요 핸들링
    const onDisLikeHandler = () => {

        //싫어요 버튼을 누르지 않았을 때,
        if(DisLikeAction === null) {
            Axios.post('/api/productLD/upDislike', variable)
                .then(result => {
                    if(result.data.success) {
                        console.log('정상적으로 싫어요 성공', result.data)
                        /**
                         * 정상적으로 싫어요 누르는데 성공했고
                         * 싫어요를 1증가 시키고
                         * 싫어요 상태를 누른 상태로 변경합니다.
                         * 만약에 좋아요를 누른 상태에서 했다면,
                         * 좋아요를 1감소 시키고
                         * 좋아요 상태를 변경합니다.
                         */
                        setDisLikes(DisLikes + 1)
                        setDisLikeAction('disliked')

                        if(LikeAction !== null) {
                            setLikes(Likes - 1)
                            setLikeAction(null)
                        }

                    } else {
                        alert("싫어요를 누르는 데 실패 했습니다.");
                    }
                })
        }
        //싫어요 버튼 눌렀을 때,
        else {
            Axios.post('/api/productLD/downDislike', variable)
                .then(result => {
                    if(result.data.success) {
                        //console.log("싫어요 취소 됐다", result.data)
                        /**
                         * 정상적으로 싫어요 취소하는데 성공했고
                         * 싫어요를 1감소 시키고
                         * 싫어요 상태를 변경합니다.
                         */
                        setDisLikes(DisLikes - 1)
                        setDisLikeAction(null)
                    } else {
                        alert("싫어요를 취소하는 데 실패 했습니다.");
                    }
                })
        }
    }

    //console.log(LikeAction)

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="좋아요">
                    <Text>좋아요</Text>&nbsp;&nbsp;
                    <Icon type="heart"
                        style={{ color: 'red' }}
                        theme={LikeAction === 'liked' ? "filled" : "outlined"}
                        onClick={onLikeHandler}
                    />
                </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {Likes} </span>
            </span>&nbsp;&nbsp;

            <span key="comment-basic-dislike">
                <Tooltip title="싫어요">
                    <Text>싫어요</Text>&nbsp;&nbsp;
                    <Icon type="dislike"
                        style={{ color: 'blue' }}
                        theme={DisLikeAction === 'disliked' ? "filled" : "outlined"}
                        onClick={onDisLikeHandler}
                    />
                </Tooltip>
            <span style={{ paddingLeft: '8px', cursor: 'auto' }}> {DisLikes} </span>
            </span>&nbsp;&nbsp;
        </div>
    )
}

export default ProductLikeDislike
