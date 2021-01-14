import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import Axios from 'axios';


function VideoUpload(props) {

    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onDrop = (files) => {

        let formData = new FormData();

        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }

        formData.append('Video', files[0])

        
        //비디오 업로드
        Axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if(response.data.success) {
                    console.log('비디오 저장',response.data);

                    //비디오가 업로드 된 url저장
                    setFilePath(response.data.url)
                    //부모 컴포넌트로 업데이트
                    props.getFilePath(response.data.url);
                    

                    let variable = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }

                    //썸네일 저장
                    Axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if(response.data.success) {
                                console.log('썸네일 저장',response.data);

                                //썸네일 저장된 경로랑 영상 길이 저장
                                setThumbnailPath(response.data.url)
                                setDuration(response.data.fileDuration)
                                //부모 컴포넌트로 업데이트
                                props.getThumbnailPath(response.data.url);
                                props.getDuration(response.data.fileDuration);
                            } else {
                                alert('썸네일 저장 실패')
                            }
                        })


                } else {
                    alert("비디오 업로드 실패")
                }
            })
    }


    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone 
            onDrop={onDrop}
            multiple={false}
            maxSize={104857600}>
                {({ getRootProps, getInputProps }) => (
                    <div
                        style={{
                            width: 300, height: 240, border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p> 영상을 여기에 올려주세요. </p>
                    </div>
                )}
            </Dropzone>

            {ThumbnailPath &&
            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>
                <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail"/>
            </div>
            }
        </div>
    )
}

export default VideoUpload
