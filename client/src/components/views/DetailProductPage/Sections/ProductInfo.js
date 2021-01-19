import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../../_actions/user_actions';
import ProductComment from './ProductComment';
import { Button, Descriptions, List, Avatar, Rate } from 'antd';
import ProductLikeDislike from './ProductLikeDislike';

function ProductInfo(props) {

    
    const dispatch = useDispatch();


    const clickHandler = () => {
        //필요한 정보를 Cart 필드에다가 넣어 준다.
        dispatch(addToCart(props.detail._id))
    }
    

    return (
        <div>
            {props.detail && props.detail.writer && 
            <div>
                <p style={{ fontSize: '16px' }}><strong>판매자 정보</strong></p>
                <List.Item
                    actions={[]}
                >
                    <List.Item.Meta
                        avatar={<Avatar src={props.detail.writer.image} />}
                        title={props.detail.writer.name+''+props.detail.writer.lastname}
                        description="여기엔 업로드할 때, 판매자의 부연설명이 들어가야 됩니다."
                    />
                </List.Item>
            </div>
            }

            <br />
            <br />

            <Descriptions title="상품 상세정보">
                <Descriptions.Item label="가격">{props.detail.price}</Descriptions.Item>
                <Descriptions.Item label="판매수">{props.detail.sold}</Descriptions.Item>
                <Descriptions.Item label="조회수">{props.detail.views}</Descriptions.Item>
                <Descriptions.Item label="상품 설명">{props.detail.description}</Descriptions.Item>
            </Descriptions>

            <br />
            <br />

            {props.averageRating &&
            <Descriptions title="상품 평점">
                <Descriptions.Item label="여기는 댓글의 모든 평점을 가져와서 평균치로 나타냄">
                    <Rate allowHalf disabled defaultValue={props.averageRating}/>
                </Descriptions.Item>
            </Descriptions>
            }
            

            <br />
            <br />
            
            <Descriptions title="상품 좋아요">
                <Descriptions.Item label="여기는 해당 상품의 좋아요 수 표시">
                    {props.detail && props.detail._id &&
                    <ProductLikeDislike product productId={props.detail._id}/>
                    }
                </Descriptions.Item>
            </Descriptions>

            <br />
            <br />
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button size="large" shape="round" type="danger" onClick={clickHandler}>
                    장바구니
                </Button>
            </div>

            <ProductComment 
            detail={props.detail} 
            productId={props.detail._id} 
            refreshFunction={props.refreshFunction} 
            reviewLists={props.reviewLists}
            afterRefresh={props.afterRefresh}
            productReviewNumber={props.productReviewNumber}
            newDateFilters={props.newDateFilters}
            />

            {props.postSize >= props.limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={props.loadMoreHandler}>더보기</button>
                </div>
            }

        </div>
    )
}

export default ProductInfo
