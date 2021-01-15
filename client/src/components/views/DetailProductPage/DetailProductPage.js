import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import { Row, Col } from 'antd';

function DetailProductPage(props) {

    const productId = props.match.params.productId

    const [Product, setProduct] = useState({})
    const [Reviews, setReviews] = useState([])

    useEffect(() => {
        Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data[0])
            })
            .catch(err => alert(err))

        let variable = {
            productId : productId
        }

        //모든 리뷰 가져오기
        Axios.post('/api/productComment/getComments', variable)
            .then(result => {
                if(result.data.success) {
                    console.log(result.data)
                    setReviews(result.data.allReview)
                } else {
                    alert("리뷰 가져오기 실패")
                }
            })
    }, [])

    const refreshFunction = (review) => {
        console.log(review);
        setReviews(Reviews.concat(review))
    }

    const afterDeleteRefresh = (review) => {
        setReviews(review)
    }

    return (
        <div style={{ width: '100%', padding: '3rem 4rem' }}>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>{Product.title}</h1>
            </div>

            <br />

            <Row gutter={[16, 16]} >
                <Col lg={12} sm={24}>
                    {/* ProductImage */}
                    <ProductImage detail={Product} />
                </Col>
                <Col lg={12} sm={24}>
                    {/* ProductInfo */}
                    <ProductInfo
                        detail={Product} 
                        reviewLists={Reviews} 
                        refreshFunction={refreshFunction} 
                        afterDeleteRefresh={afterDeleteRefresh} />
                </Col>
            </Row>





        </div>
    )
}

export default DetailProductPage
