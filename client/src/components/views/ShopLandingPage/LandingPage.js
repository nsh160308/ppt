import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Col, Card, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import Checkbox from './Sections/CheckBox';
import Radiobox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
import { continents, price } from './Sections/Datas';
import SubMenuPage from './Sections/SubMenuPage';

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continents: [],
        price: [],
        clothes: []
    })
    const [SearchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        let body = {
            skip: Skip,
            limit: Limit
        }
        getProducts(body)
    }, [])

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
            .then(response => {
                console.log('Shop랜딩 결과', response.data);
                if (response.data.success) {
                    if (body.loadMore) {
                        setProducts([...Products, ...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert(" 상품들을 가져오는데 실패 했습니다.")
                }
            })
    }

    const loadMoreHanlder = () => {

        let skip = Skip + Limit
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true,
            filters: Filters
        }
        getProducts(body)
        setSkip(skip)
    }

    const renderCards = Products.map((product, index) => {
        return <Col lg={6} md={8} xs={24} key={index}>
            <Card
                cover={<a href={`/product/${product._id}`} ><ImageSlider images={product.images} /></a>}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

    const showFilteredResults = (filters) => {
        console.log('showFiltered', filters);
        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }
        console.log('body', body);
        getProducts(body)
        setSkip(0)
    }

    const handlePrice = (value) => {
        console.log('value', value);
        const data = price;
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value, 10)) {
                array = data[key].array;
            }
        }
        return array;
    }

    const handleFilters = (filters, category) => {
        console.log('filters', filters);
        console.log('category', category);
        const newFilters = { ...Filters }
        newFilters[category] = filters
        console.log('filters', filters)
        if (category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }
        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerm = (newSearchTerm) => {
        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }
        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }

    return (
        <div style={{ width: '85%', margin: '1rem auto'}}>
            <Row gutter={[16, 16]}>
                <Col lg={4}>
                    <div style={{ border: '1px solid black'}}>
                        {/* Filter */}
                        <SubMenuPage handleFilters={filters => handleFilters(filters, "clothes")}/>
                    </div>
                </Col>
                <Col lg={20}>
                    <div style={{ border: '1px solid black'}}>
                        {/* Search */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
                            <SearchFeature
                                refreshFunction={updateSearchTerm}
                            />
                        </div>
                        {/* Cards */}
                        <Row gutter={[16, 16]} >
                            {renderCards}
                        </Row>
                        <br />
                        {/* LoadMore */}
                        {PostSize >= Limit &&
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button onClick={loadMoreHanlder}>더보기</button>
                            </div>
                        }
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default LandingPage
