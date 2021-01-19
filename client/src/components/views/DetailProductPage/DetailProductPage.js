import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import { Row, Col } from 'antd';

function DetailProductPage(props) {

    const productId = props.match.params.productId

    const [Product, setProduct] = useState({})
    const [Reviews, setReviews] = useState([])

    //해당 상품에 대한 리뷰를 작성한 회원들의 모든 평점을 평균낸 값을 관리하는 state
    const [AverageRating, setAverageRating] = useState(0)
    //해당 상품에 등록된 리뷰 개수를 관리하는 state
    const [AllPostSize, setAllPostSize] = useState(0)
    //스킵
    const [Skip, setSkip] = useState(0)
    //리미트
    const [Limit, setLimit] = useState(10)
    //가져온 리뷰의 개수를 관리하는 state
    const [PostSize, setPostSize] = useState(0)
    //더보기 버튼 관리 state
    const [LoadMoreBtn, setLoadMoreBtn] = useState(null)

    let variables = {};

    useEffect(() => {
        Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data[0])
            })
            .catch(err => alert(err))
        variables = { productId: productId, pageStatus: 'default' }
        getReviews(variables)
    }, [])

    const getReviews = (variables) => {
        console.log('현재 받은 객체', variables)
        //인자로 받은 variables을 전달해서 백엔드에게 리뷰 정보를 요청합니다.
        Axios.post('/api/productComment/getComments', variables)
            .then(result => {
                if(result.data.success) {
                    //1)모든 리뷰 결과
                    if(result.data.pageStatus === 'default') {
                        console.log('모든 리뷰 가져오기', result.data);
                        setAllPostSize(result.data.postSize);
                        averageRating(result.data.reviews)
                        //2)10개만 가져오기
                        variables = {
                            skip: Skip,
                            limit: Limit,
                            productId: productId,
                            pageStatus: 'limited'
                        }
                        getReviews(variables)
                    } else if(result.data.pageStatus === 'limited') {
                        //3)리뷰 10개 결과
                        console.log('10개의 리뷰', result.data);
                        setReviews(result.data.reviews);
                        setPostSize(result.data.postSize);
                        setLoadMoreBtn(true)
                    } else if(result.data.pageStatus === 'Sort by latest') {
                        console.log('최신리뷰', result.data);
                        setReviews(result.data.reviews);
                        setPostSize(result.data.postSize);
                        setLoadMoreBtn(false)
                    }

                    /**
                     * [loadMore 버튼 결과 로직]
                     * 'default'면 정렬없이 loadMore 동작
                     * 'Sort by latest'면 최신리뷰 순으로 loadMore 동작
                     * loadMore 동작 후 가져온 postSize가 Limit state보다 작다면
                     * 더 이상 가져올 데이터가 없단 뜻으로 Skip state를 0으로 초기화
                     */
                    if(result.data.loadMorePage === 'default') {
                        console.log('더보기', result.data);
                        setReviews([...Reviews, ...result.data.reviews])
                        setPostSize(result.data.postSize);
                        if(result.data.postSize < Limit) {
                            setSkip(0)
                        }
                    } else if(result.data.loadMorePage === 'Sort by latest') {
                        setReviews([...Reviews, ...result.data.reviews])
                        setPostSize(result.data.postSize);
                        if(result.data.postSize < Limit) {
                            setSkip(0)
                        }
                    }

                } else {
                    alert("getReviews Function failed");
                }
            })
    }

    const refreshFunction = (review) => {
        console.log(review);
        //setReviews(Reviews.concat(review))
        setAllPostSize(AllPostSize + 1)
    }

    const afterRefresh = (reviewLists) => {
        let array = [];
        if(reviewLists.modify) {
            Reviews.map(review => {
                if(review._id === reviewLists._id) {
                    review = reviewLists
                    array.push(review)
                } else array.push(review)

                return array
            })
            setReviews(array)
        } else {
            setReviews(reviewLists)
        }
    }

    //모든 리뷰의 평점을 합해서 평균을 구하는 함수
    const averageRating = (reviews) => {
        //모든 리뷰의 총점을 저장할 변수
        let total = 0;
        /**
         * 모든 리뷰를 forEach()를 이용해 각각의 리뷰들의 평점을
         * total변수에 저장합니다.
         */
        reviews.forEach(review => {
            total += review.rating
        })
        //총점을 리뷰 개수로 나누면 모든 리뷰의 평균 평점이 나옵니다.
        let averating = total / reviews.length;
        //평균 평점을 관리하는 state에 저장합니다.
        setAverageRating(averating);
    }

    //더보기
    const loadMoreHandler = () => {
        console.log('더 보기 클릭')

        let skip = Skip + Limit;

        if(LoadMoreBtn) {
            variables = {
                skip: skip,
                limit: Limit,
                productId: productId,
                loadMore: 'default'
            }
            getReviews(variables);
            setSkip(skip)
        } else {
            variables = {
                skip: skip,
                limit: Limit,
                productId: productId,
                loadMore: 'Sort by latest'
            }
            getReviews(variables);
            setSkip(skip)
        }
        
    }

    //최신 리뷰 순 정렬
    const newDateFilters = () => {
        console.log('최신 리뷰 정렬 클릭')

        variables = {
            skip: 0,
            limit: Limit,
            productId: productId,
            pageStatus: 'Sort by latest'
        }
        getReviews(variables)
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
                        afterRefresh={afterRefresh}
                        averageRating={AverageRating}
                        productReviewNumber={AllPostSize}
                        postSize={PostSize}
                        limit={Limit}
                        loadMoreHandler={loadMoreHandler}
                        newDateFilters={newDateFilters} />
                </Col>
            </Row>
        </div>
    )
}

export default DetailProductPage
