import React, { useEffect } from 'react'
import { Button } from 'antd';
import "./UserCardBlock.css"
function UserCardBlock(props) {
    

    console.log(props.products);
    

    const renderCartImage = (images) => {
        if (images.length > 0) {
            let image = images[0]
            return `http://localhost:5000/${image}`
        }
    }

    const renderItems = () => (
        props.products && props.products.map((product, index) => (
            <tr key={index}>
                <td>
                    {++index}
                </td>
                <td>
                    <img style={{ width: '70px' }} alt="product"
                        src={renderCartImage(product.images)} />
                </td>
                <td>
                    {product.size}
                </td>
                <td>
                    {product.quantity}
                </td>
                <td>
                    $ {product.price}
                </td>
                <td>
                    {/* 사이즈랑 품번 넘김 */}
                    <Button onClick={() => props.removeItem(product.size, product._id)}>
                        비우기
                    </Button>
                </td>
            </tr>
        ))
    )
    
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제품 이미지</th>
                        <th>사이즈</th>
                        <th>제품 개수</th>
                        <th>제품 가격</th>
                        <th>비고</th>
                    </tr>
                </thead>

                <tbody>
                    {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default UserCardBlock
