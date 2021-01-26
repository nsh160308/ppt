import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getCartItems, removeCartItem, onSuccessBuy, updateCartItem } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { Empty, Result, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import Paypal from '../../utils/Paypal';

const CartStyle = {
    width: '85%', 
    margin: '3rem auto',
    fontFamily:"Georgia",
    fontWeight:"bold", 
}

function CartPage(props) {
    const dispatch = useDispatch();

    const user = useSelector(state => state.user)

    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)
    const [CartDetails, setCartDetails] = useState([])

    useEffect(() => {
        let cartItems = []
        //리덕스 User state안에 cart 안에 상품이 들어있는지 확인 
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {//장바구니에 하나 이상 있다면
                props.user.userData.cart.forEach(item => {//forEach
                    cartItems.push(item.id)//장바구니에 담긴 개수 만큼 id를 배열에 넣어 관리
                })
                //dispatch통해서 action호출
                //인자로 장바구니 상품의 id를 담은 배열과 전체 장바구니의 정보
                dispatch(getCartItems(cartItems, props.user.userData.cart))
                    .then(response => { 
                        calculateTotal(response.payload);
                        setCartDetails(response.payload);
                    })
            }
        }
    }, [props.user.userData])

    //장바구니 합계
    let calculateTotal = (cartDetail) => {
        let total = 0;
        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity
        })
        setTotal(total)
        setShowTotal(true)
    }

    //선택한 제품 지우기
    let removeFromCart = (size, productId) => {
        //카드블록에서 제품 사이즈랑 품번 받음
        console.log('제품 사이즈', size);
        console.log('제품 아이디', productId);
        //디스패치로 사이즈랑 품번을 액션한테 줘서 액션 호출
        dispatch(removeCartItem(size, productId))
            .then(response => {
                console.log('액션 결과',response.payload);
                if (response.payload.length <= 0) {
                    setShowTotal(false)
                }
                setCartDetails(response.payload);
            })
    }
    //결제 성공 후 장바구니 비우기
    const transactionSuccess = (data) => {
        console.log(data);
        dispatch(onSuccessBuy({
            paymentData: data,
            cartDetail: props.user.cartDetail
        }))
            .then(response => {
                if (response.payload.success) {
                    setCartDetails(response.payload.cartDetail);
                    setShowTotal(false)
                    setShowSuccess(true)
                }
            })
    }

    //페이지 이동
    const movePage = () => {
        props.history.push('/Shop')
    }

    return (
        <div style={{...CartStyle}}>
            <h1>Cart / 장바구니</h1>
            <div>
                <UserCardBlock products={CartDetails} removeItem={removeFromCart}/>
            </div>
            {ShowTotal ?
                <div style={{ marginTop: '3rem' }}>
                    <h2>Total Amount: ${Total}</h2>
                </div>
                : ShowSuccess ?
                    <Result
                    icon={<SmileOutlined />}
                    title="결제가 완료됐습니다!"
                    extra={<Button onClick={movePage} type="primary">Go to Home</Button>}
                    />
                    :
                    <Empty
                        style={{ marginTop: 30}}
                        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                        imageStyle={{
                        height: 60,
                        }}
                        description={<span>Empty Cart / 장바구니가 비었습니다.</span>}
                    >
                        <Button type="primary" onClick={movePage}>Go to Shop</Button>
                    </Empty>
            }
            {ShowTotal &&
                <Paypal
                    total={Total}
                    onSuccess={transactionSuccess}
                />
            }
        </div>
    )
}

export default CartPage
