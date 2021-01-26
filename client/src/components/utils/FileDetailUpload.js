import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import axios from 'axios';

function FileDetailUpload(props) {

    const [DetailImages, setDetailImages] = useState([])

    const dropHandler = (files) => {

        console.log('디테일 이미지 업로드', files);

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])

        axios.post('/api/product/image', formData, config)
            .then(response => {
                if (response.data.success) {
                    setDetailImages([...DetailImages, response.data.filePath])
                    props.refreshFunction([...DetailImages, response.data.filePath])
                } else {
                    alert('파일을 저장하는데 실패했습니다.')
                }
            })
    }

    const deleteHandler = (image) => {
        const currentIndex = DetailImages.indexOf(image);
        let newDetailImages = [...DetailImages]
        newDetailImages.splice(currentIndex, 1)
        setDetailImages(newDetailImages)
        props.refreshFunction(newDetailImages)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone onDrop={dropHandler}>
                {({ getRootProps, getInputProps }) => (
                    <div
                        style={{
                            width: 300, height: 240, border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p> 상품의 디테일 이미지를 여기에 올려주세요. </p>
                    </div>
                )}
            </Dropzone>

            <div style={{ width: '350px', height: '240px' }}>
                {DetailImages.map((image, index) => (
                    <div onClick={() => deleteHandler(image)} key={index}>
                        <ul>
                            <li>{image}</li>
                        </ul>
                    </div>
                    
                ))}
            </div>
        </div>
    )
}

export default FileDetailUpload
