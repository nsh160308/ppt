import React from 'react'
import { Comment, Avatar, Button, Input } from 'antd';


function ProductSingleComment() {
    return (
        <div>
            <Comment
                actions
                author
                avatar
                content
            />

            <form style={{ display: 'flex' }} onSubmit>
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange
                    value
                    placeholder="공개 댓글 추가"
                />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick>댓글</button>
            </form>
        </div>
    )
}

export default ProductSingleComment
