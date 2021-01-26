import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../../_actions/user_actions';
import ProductComment from './ProductComment';
import { Button, Descriptions, List, Avatar, Rate, Select } from 'antd';
import ProductLikeDislike from './ProductLikeDislike';

const { Option } = Select;
const productInfoStyle = {
    fontFamily:"Georgia",
    fontWeight:"bold",
}

const Sizes = [
    {"key": 1, "value": 'XS'},
    {"key": 2, "value": 'S'},
    {"key": 3, "value": 'M'},
    {"key": 4, "value": 'L'},
    {"key": 5, "value": 'XL'},
    {"key": 6, "value": '2XL'},
]

function ProductInfo(props) {
    //console.log('detail정보', props.detail);
    const [Size, setSize] = useState("XS");
    const dispatch = useDispatch();
    const clickHandler = () => {
        //필요한 정보를 Cart 필드에다가 넣어 준다.
        dispatch(addToCart(props.detail._id, Size))
            .then(response => {
                console.log(response);
                if(response.payload.duplicateOptions) {
                    alert('이미 장바구니에 담겨져있습니다.');
                }
            })
    }

    const sizeChangeHandler = (e) => {
        console.log('size', e);
        setSize(e);
    }

    return (
        <div style={{...productInfoStyle}}>
            <Descriptions title="Product Info / 상품 상세정보">
                <Descriptions.Item label="가격">${props.detail.price}</Descriptions.Item>
                <Descriptions.Item label="판매수">{props.detail.sold}</Descriptions.Item>
                <Descriptions.Item label="조회수">{props.detail.views}</Descriptions.Item>
                <Descriptions.Item label="상품 설명">{props.detail.description}</Descriptions.Item>
            </Descriptions>

            <br />
            <br />

            {props.averageRating ?
            <Descriptions title="Product Rating / 상품 평점">
                <Descriptions.Item>
                    <Rate allowHalf disabled defaultValue={props.averageRating}/>
                </Descriptions.Item>
            </Descriptions>
            :
            <Descriptions title="Product Rating / 상품 평점">
                <Descriptions.Item>
                    아직 상품에 대한 평점이 없습니다.
                </Descriptions.Item>
            </Descriptions>
            }
            <br />
            <br />
            
            <Descriptions title="Product Likes / 상품 좋아요">
                <Descriptions.Item label>
                    {props.detail && props.detail._id &&
                    <ProductLikeDislike product productId={props.detail._id}/>
                    }
                </Descriptions.Item>
            </Descriptions>

            <br />
            <br />

            <Descriptions title="Size / 사이즈">
                <Descriptions.Item>
                    <Select
                        value={Size} 
                        style={{width: 120}}
                        onChange={sizeChangeHandler}
                    >
                        {Sizes.map((size, index) => (
                            <Option 
                                key={index} 
                                value={size.value}
                            >
                                {size.value}
                            </Option>
                        ))}
                    </Select>
                </Descriptions.Item>
            </Descriptions>
            
            <br />
            <br />

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button size="large" shape="round" type="danger" onClick={clickHandler}>
                    Add to Cart / 장바구니
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
            replayHandle={props.replayHandle}
            />

            {props.postSize >= props.limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="primary" onClick={props.loadMoreHandler}>Load More</Button>
                </div>
            }

        </div>
    )
}

export default ProductInfo
