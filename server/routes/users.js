const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { Payment } = require("../models/Payment");
const { auth } = require("../middleware/auth");
const async = require('async');
const nodemailer = require('nodemailer');//이메일 전송 모듈
const passport = require('passport');//Passport 모듈
const config = require('../config/key');

//=================================
//             User
//=================================

// 인증
router.get("/auth", auth, (req, res) => {
    console.log('auth 미들웨어가 next로 이곳으로 오게함', req.user);
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history,
    });
});

// 가입
router.post("/register", (req, res) => {
    console.log('registerUser의 Axios가 준 정보', req.body);
    //신규 회원 생성
    const user = new User(req.body);
    user.save((err, newUser) => {
        //서버 에러
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

// 로그인
router.post("/login", (req, res, next) => {
    console.log('Axios가 준 정보', req.body);
    console.log('query', req.query);
    //로컬 로그인
    passport.authenticate("local", (err, user, info) => {
        console.log('이 함수가 호출되면 인증에 성공!');
        console.log('passport가 준 정보', err, user, info);
        //서버 에러
        if(err) return next(err);
        //유저가 없다면 passport에서 만들어 낸 msg가 info에 들어와 이 것을 리턴
        if(!user) {
            console.log("유저가 존재하지 않아", info);
            return res.json({ msg: info });
        }
        /**
         * 커스텀 콜백함수를 사용했기 때문에
         * req.logIn함수를 호출해서 세션을 설정하고 response를 보낸다.
         * 로그인 작업이 완료되면, user가 req.user에 할당된다.
         */
        req.logIn(user, function (err) {
            if(err) return next(err);
            return res.status(200).json({ loginSuccess: true, userId: user._id })//user_action한테 전달됨
        });
    })(req, res, next)
});

// 로그아웃
router.get("/logout", auth, (req, res) => {
    req.logout();
    res.status(200).send({
        success: true,
    })
});

// 장바구니 저장
router.post("/addToCart", auth, (req, res) => {
    console.log('/addToCart', req.body);
    //먼저  User Collection에 해당 유저의 정보를 가져오기 
    User.findOne({ _id: req.user._id },
        (err, userInfo) => {
            console.log('userInfo', userInfo);
            //해당 유저의 장바구니에 있는 상품을 하나씩 비교
            let duplicateProduct = false;
            let duplicateOptions = false;
            //장바구니에 몇개의 상품이 있는지
            userInfo.cart.forEach((item) => {
                if(item.id === req.body.productId && item.size === req.body.size) {
                    duplicateProduct = true;
                    duplicateOptions = true;
                }
            })

            //동일한 상품 (수정)
            if(duplicateProduct) {
                console.log('동일한 상품')
                if(duplicateOptions) {//동일한 옵션
                    console.log('동일한 옵션')
                    res.json({
                        cart: userInfo.cart,
                        duplicateOptions: true//추가
                    })
                } else {//다른 옵션
                    console.log('동일 상품 - 다른 옵션')
                    User.findOneAndUpdate(
                        { _id: req.user._id },
                        {
                            $push: {
                                cart: {
                                    id: req.body.productId,
                                    quantity: 1,
                                    size: req.body.size,
                                    date: Date.now(),
                                }
                            }
                        },
                        { new: true },
                        (err, userInfo) => {
                            if(err) return res.status(400).json({ success:false, err })
                            res.status(200).send(userInfo.cart)
                        }
                    )
                }
            } else {//새로운 상품
                console.log('새로운 상품');
                User.findOneAndUpdate(
                    { _id: req.user._id },
                    {
                        $push: {
                            cart: {
                                id: req.body.productId,
                                quantity: 1,
                                size: req.body.size,
                                date: Date.now(),
                            }
                        }
                    },
                    { new: true },
                    (err, userInfo) => {
                        if(err) return res.status(400).json({ success:false, err })
                        res.status(200).send(userInfo.cart)
                    }
                )
            }
        })
});

// 장바구니 삭제
router.get('/removeFromCart', auth, (req, res) => {

    //axios가 준 제품 사이즈와 품번을 변수에 저장
    let size = req.query.size;
    let id = req.query.id;
    //알맞게 가져왔는지 디버깅
    console.log('사이즈',size);
    console.log('품번', id);

    //먼저 cart안에 내가 지우려고 한 상품을 지워주기 
    //상품id랑 사이즈 두개를 조건으로 주면 그것만 삭제가 되겠지?

    User.findOneAndUpdate(
        {_id: req.user._id },
        {
            $pull: { cart: { id: id }, cart: { size: size }}
        },
        { new :true },
        (err, result) => {
            let cart = result.cart;
            let array = cart.map(item => {
                return item.id;
            })
            //product collection에서  현재 남아있는 상품들의 정보를 가져오기
            let promise = array.map((item) => {
                return Product.findOne({_id: item})
                    .populate('writer')
                    .exec()
            })
            //배열형태로 받은 프로미스를 Promise.all()로 받고 res에 실어서 보냄
            Promise.all(promise)
                .then(response => {
                    console.log(response);
                    res.status(200).json({ success:true, productInfo: response, cart: cart})
                })
        }
    )

    // User.findOneAndUpdate(
    //     { _id: req.user._id },
    //     {
    //         "$pull": {
    //             cart : {
    //                 "cart._id": id,
    //                 "cart.size": size
    //             }
    //         }
    //     },
    //     { new: true },
    //     (err, userInfo) => {
    //         if(err) {
    //             console.log('error', err);
    //         }

    //         console.log('userInfo', userInfo);

    //         let cart = userInfo.cart;
    //         let array = cart.map(item => {
    //             return item.id
    //         })
    //         //product collection에서  현재 남아있는 상품들의 정보를 가져오기 
    //         //productIds = ['5e8961794be6d81ce2b94752', '5e8960d721e2ca1cb3e30de4'] 이런식으로 바꿔주기
    //         Product.find({ _id: { $in: array } })
    //             .populate('writer')
    //             .exec((err, productInfo) => {
    //                 return res.status(200).json({
    //                     productInfo,
    //                     cart
    //                 })
    //             })
    //     }
    // )
})

// 결제 성공
router.post('/successBuy', auth, (req, res) => {

    console.log('/successBuy', req.body);
    console.log('user', req.user);

    //1. User Collection 안에  History 필드 안에  간단한 결제 정보 넣어주기
    let history = [];
    let transactionData = {};
    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: Date.now(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })
    //2. Payment Collection 안에  자세한 결제 정보들 넣어주기 
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    transactionData.data = req.body.paymentData
    transactionData.product = history

    console.log('history', history);
    console.log('transaction', transactionData);


    // User.findOne(
    //     { _id: req.user._id }
    // ).exec((err, result) => {
    //     console.log('result', result);
    // })

    // User.findOneAndUpdate(
    //     { _id: req.user._id },
    //     { $push: { history: history }, $set: { 'cart': [] }},
    //     { new: true }
    // ).exec((err, result) => {
    //     console.log('err', err);
    //     console.log('FOAU', result)
    // })

    //history 정보 저장 
    User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { history: history }, $set: { cart: [] } },
        { new: true },
        (err, user) => {

            console.log('user', user);

            if (err) return res.json({ success: false, err })
            //payment에다가  transactionData정보 저장 
            const payment = new Payment(transactionData)
            payment.save((err, doc) => {
                if (err) return res.json({ success: false, err })
                //3. Product Collection 안에 있는 sold 필드 정보 업데이트 시켜주기 
                //상품 당 몇개의 quantity를 샀는지 
                let products = [];
                doc.product.forEach(item => {
                    products.push({ id: item.id, quantity: item.quantity })
                })
                async.eachSeries(products, (item, callback) => {
                    Product.update(
                        { _id: item.id },
                        {
                            $inc: {
                                "sold": item.quantity
                            }
                        },
                        { new: false },
                        callback
                    )
                }, (err) => {
                    if (err) return res.status(400).json({ success: false, err })
                    res.status(200).json({
                        success: true,
                        cart: user.cart,
                        cartDetail: []
                    })
                }
                )
            })
        }
    )
})

//중복 이메일 체크
router.post('/checkEmail', (req, res) => {
    //이메일 잘 넘어 왔는지 체크
    console.log('newEmail', req.body);
    User.find({ 'email': req.body.email }, (err, result) => {
        //잘 찾았는지 체크
        console.log('result', result);
        //에러 처리
        if(err) return res.send(err)
        //0이 아니면 중복된 이메일
        if(result.length != 0) {
            return res.status(200).json({ duplicate: true })
        } else res.status(200).json({ duplicate: false })
    })
})

//이메일 보내기
router.post('/sendEmail', async (req, res) => {
    //이메일 잘 넘어 왔는지 체크
    console.log('newEmail', req.body);
    //인증코드 생성
    let key_for_verify = Math.random().toString(36).substr(2,6);
    //메일 발송하는 사람
    let transporter = nodemailer.createTransport({
        // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
        service: 'gmail',
        // host를 gmail로 설정
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            //Gmail 주소 입력
            user: config.gmailAddress,
            //Gmail 패스워드 입력
            pass: config.gmailPassword
        }
    })
    //메일 보내기
    let sendEmail = await transporter.sendMail({
        from: '',
        to: req.body.email,
        subject: '안녕하세요~',
        text: `인증번호: ${key_for_verify}`
    })
    let verifyKey = {
        verifyKey: key_for_verify
    }
    res.send(verifyKey)
})
module.exports = router;
