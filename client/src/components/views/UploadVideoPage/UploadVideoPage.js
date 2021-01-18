import React, { useState } from 'react'
import { Typography, Button, Form, Input, Select, message } from 'antd';
import VideoUpload from '../../utils/VideoUpload'
import Axios from 'axios';
import { useSelector } from 'react-redux';

const { TextArea } = Input;
const { Title } = Typography
const { Option } = Select;

const Categories = [
    { key: 0, label: "영화 & 음악"},
    { key: 1, label: "오락"},
    { key: 2, label: "스포츠"},
    { key: 3, label: "음식"},
    { key: 4, label: "학습"},
]

const PrivateOptions = [
    { key: 0, label: 'Private'},
    { key: 1, label: 'Public'}
]

function UploadVideoPage(props) {
    const user = useSelector(state => state.user)
    const [VideoTitle, setVideoTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Authority, setAuthority] = useState(0)
    const [Category, setCategory] = useState("영화 & 음악")

    //자식으로 받은 데이터 함수로 받아서 state로 업데이트
    const [FilePath, setFilePath] = useState("") //비디오 저장된 경로
    const [ThumbnailPath, setThumbnailPath] = useState("")  //썸네일 저장된 경로
    const [Duration, setDuration] = useState(0) //영상 길이

    //이름
    const videoTitleHandler = (e) => {
        setVideoTitle(e.target.value)
    }

    //설명
    const descriptionHandler = (e) => {
        setDescription(e.target.value)
    }

    //권한
    const authorityHandler = (e) => {
        //console.log(e);
        setAuthority(e)
    }

    //카테고리
    const categoryHandler = (e) => {
        //console.log(e);
        setCategory(e)
    }

    const onSubmitHandler = (e) => {
        e.preventDefault();

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Authority,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: ThumbnailPath
        }

        Axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data)

                    message.success("업로드 성공")

                    setTimeout(() => {
                        props.history.push('/Mytube')
                    }, 1000);
                    
                    
                } else {
                    alert("비디오 업로드 실패");
                }
            })
    }

    //비디오 저장 경로 받는 함수
    const getFilePath = (filePath) => {

        //console.log(filePath);
        setFilePath(filePath);
    }

    //썸네일 저장 경로 받는 함수
    const getThumbnailPath = (thumbnail) => {

        //console.log(thumbnail);
        setThumbnailPath(thumbnail);
    }

    //영상 시간 받는 함수
    const getDuration = (duration) => {

        //console.log(duration);
        setDuration(duration);
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Title> 영상 업로드 </Title>
            </div>

            <Form onSubmit={onSubmitHandler}>
                {/* DropZone */}
                <VideoUpload getFilePath={getFilePath} getThumbnailPath={getThumbnailPath} getDuration={getDuration}/>


                <br />
                <br />

                <label>이름</label>
                <Input onChange={videoTitleHandler} value={VideoTitle} />
                
                <br />
                <br />
                
                <label>설명</label>
                <TextArea onChange={descriptionHandler} value={Description} />

                <br />
                <br />

                <Select style={{ width: '120px' }} onChange={authorityHandler} value={Authority}>
                    {PrivateOptions.map((item, index) => (
                        <Option key={index} value={item.key}>{item.label}</Option>
                    ))}
                </Select>

                <br />
                <br />

                <Select style={{ width: '120px' }} onChange={categoryHandler} value={Category}>
                    {Categories.map((item, index) => (
                        <Option key={index} value={item.key}>{item.label}</Option>
                    ))}
                </Select>

                <br />
                <br />
                
                <Button type="primary" size="large" onClick={onSubmitHandler}>
                    업로드
                </Button>
            </Form>
        </div>
    )
}

export default UploadVideoPage
