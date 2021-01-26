import React, { useState } from 'react'
import { Form, Input, Select, Button, Modal } from 'antd';
import FileUpload from '../../utils/FileUpload';
import FileDetailUplaod from '../../utils/FileDetailUpload';
import Axios from 'axios';
const { TextArea } = Input;
const { Option } = Select;
const Clothes = [
    { key: 1, value: "Jacket" },
    { key: 2, value: "Coat" },
    { key: 3, value: "Long Sleeve" },
    { key: 4, value: "Short Sleeve" },
    { key: 5, value: "Jeans" },
    { key: 6, value: "Pants" },
]
const MenuStyle = {
    fontSize:"14px",
    fontFamily:"Georgia",
    fontWeight:"bold",
}
const ParentStyle = {
    fontSize:"14px",
    fontFamily:"Georgia",
    fontWeight:"bold",
    maxWidth: '700px', 
    margin: '2rem auto'
}

function UploadProductPage(props) {

    const [Title, setTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Price, setPrice] = useState(null)
    const [Cloth, setCloth] = useState(1)
    const [Images, setImages] = useState([])
    const [DetailImages, setDetailImages] = useState([])

    const titleChangeHandler = (event) => {
        setTitle(event.currentTarget.value)
    }

    const descriptionChangeHandler = (event) => {
        setDescription(event.currentTarget.value)
    }

    const priceChangeHandler = (event) => {
        setPrice(event.currentTarget.value)
    }

    const clothesChangeHandler = (event) => {
        setCloth(event);
    }

    const updateImages = (newImages) => {
        setImages(newImages)
    }

    const updateDetailImages = (newDetailImages) => {
        console.log('디테일 이미지', newDetailImages);
        setDetailImages(newDetailImages);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        if (!Title || !Description || !Price || !Cloth || !DetailImages || Images.length === 0) {
            return Modal.error({
                title: 'Upload Error',
                content: 'Enter all values!'
            })
        }
        //서버에 채운 값들을 request로 보낸다.
        const body = {
            //로그인 된 사람의 ID 
            writer: props.user.userData._id,
            title: Title,
            description: Description,
            price: Price,
            images: Images,
            detailImages: DetailImages,
            clothes: Cloth
        }
        Axios.post('/api/product', body)
            .then(response => {
                if (response.data.success) {
                    alert('상품 업로드에 성공 했습니다.')
                    props.history.push('/Shop')
                } else {
                    alert('상품 업로드에 실패 했습니다.')
                }
            })
    }


    return (
        <div style={ParentStyle}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2>Product Upload / 상품 업로드</h2>
            </div>

            <Form onSubmit={submitHandler}>
                {/* DropZone */}
                <FileUpload refreshFunction={updateImages} />

                <br />
                <FileDetailUplaod refreshFunction={updateDetailImages}/>

                <br />
                <br />
                <label>Product Name / 상품 이름</label>
                <Input onChange={titleChangeHandler} value={Title} />
                <br />
                <br />
                <label>Product Description / 상품 설명</label>
                <TextArea onChange={descriptionChangeHandler} value={Description} />
                <br />
                <br />
                <label>Price($) / 가격(달러)</label>
                <Input type="number" onChange={priceChangeHandler} value={Price} />
                <br />
                <br />
                <label>List / 구분</label><br />
                <Select onChange={clothesChangeHandler} value={Cloth} style={{ width: 120 }}>
                    {Clothes.map(item => (
                        <Option key={item.key} value={item.key}> {item.value}</Option>
                    ))}
                </Select>
                <br />
                <br />
                <Button type="primary" onClick={submitHandler}>
                    Upload / 업로드
                </Button>
            </Form>
        </div>
    )
}

export default UploadProductPage
