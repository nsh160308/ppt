const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { Payment } = require("../models/Payment");

const { auth } = require("../middleware/auth");
const async = require('async');

//이메일 전송 모듈
const nodemailer = require('nodemailer');
//인증코드 생성 모듈
const crypto = require('crypto');

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
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
        accessToken: req.user.access_token
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    //소셜 로그인 시
    if(req.body.oAuthId) {//요청 body에 oAuthId 키가 존재하는지 체크
        console.log('카카오 정보', req.body);
        //만약 존재한다면, DB에 해당 oAuthId를 갖는 유저를 찾는다.
        User.findOne({ oAuthId: req.body.oAuthId }, (err, user) => {
            //해당된 유저가 없다면
            if(!user) {
                const KakaoUser = new User(req.body);
                console.log('카카오 유저', KakaoUser);
                //계정 생성
                KakaoUser.save((err, doc) => {
                    console.log('db에 저장한 결과', doc);
                    //저장 중 에러 발생시
                    if(err) return res.json({ success: false, err })
                    //다시 찾는다.
                    User.findOne({ oAuthId: req.body.oAuthId }, (err, user) => {
                        console.log('db에서 찾은 결과', user);
                        user.generateToken((err, userInfo) => {
                            console.log('토큰 생성 결과?', userInfo);
                            if(err) return res.status(400).send(err);
                            res.cookie('w_authExp', userInfo.tokenExp)
                            res
                                .cookie('w_auth', userInfo.token)
                                .cookie('kakao_access_token', userInfo.access_token)
                                .status(200)
                                .json({
                                    loginSuccess: true,
                                    userId: userInfo._id
                                })
                        })
                    })
                })
            } else {    //해당되는 유저가 있다면
                User.findOneAndUpdate(
                    { oAuthId: req.body.oAuthId },
                    { $set: { access_token: req.body.access_token }},
                    { new: true},
                    (err, user) => {
                        console.log('결과~~', user);
                        user.generateToken((err, user) => {
                            if (err) return res.status(400).send(err);
                            res.cookie("w_authExp", user.tokenExp);
                            res
                                .cookie("w_auth", user.token)
                                .status(200)
                                .json({
                                    loginSuccess: true, userId: user._id
                                });
                        });
                })
            }
        })
    } else { // 일반 로그인
        User.findOne({ email: req.body.email }, (err, user) => {
            if (!user)
                return res.json({
                    loginSuccess: false,
                    message: "해당 이메일에 맞는 유저가 없습니다."
                });
            // 비밀번호 확인
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (!isMatch)
                    return res.json({ loginSuccess: false, message: "비밀번호가 맞지 않습니다." });
                // 토큰 생성
                user.generateToken((err, user) => {
                    if (err) return res.status(400).send(err);
                    res.cookie("w_authExp", user.tokenExp);
                    res
                        .cookie("w_auth", user.token)
                        .status(200)
                        .json({
                            loginSuccess: true, userId: user._id
                        });
                });
            });
        });
    }
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "", access_token: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/kakao", (req, res) => {
    console.log(req.body);
});


router.post("/addToCart", auth, (req, res) => {

    //먼저  User Collection에 해당 유저의 정보를 가져오기 
    User.findOne({ _id: req.user._id },
        (err, userInfo) => {

            // 가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는지 확인 

            let duplicate = false;
            userInfo.cart.forEach((item) => {
                if (item.id === req.body.productId) {
                    duplicate = true;
                }
            })

            //상품이 이미 있을때
            if (duplicate) {
                User.findOneAndUpdate(
                    { _id: req.user._id, "cart.id": req.body.productId },
                    { $inc: { "cart.$.quantity": 1 } },
                    { new: true },
                    (err, userInfo) => {
                        if (err) return res.status(200).json({ success: false, err })
                        res.status(200).send(userInfo.cart)
                    }
                )
            }
            //상품이 이미 있지 않을때 
            else {
                User.findOneAndUpdate(
                    { _id: req.user._id },
                    {
                        $push: {
                            cart: {
                                id: req.body.productId,
                                quantity: 1,
                                date: Date.now()
                            }
                        }
                    },
                    { new: true },
                    (err, userInfo) => {
                        if (err) return res.status(400).json({ success: false, err })
                        res.status(200).send(userInfo.cart)
                    }
                )
            }
        })
});


router.get('/removeFromCart', auth, (req, res) => {

    //먼저 cart안에 내가 지우려고 한 상품을 지워주기 
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            "$pull":
                { "cart": { "id": req.query.id } }
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })

            //product collection에서  현재 남아있는 상품들의 정보를 가져오기 

            //productIds = ['5e8961794be6d81ce2b94752', '5e8960d721e2ca1cb3e30de4'] 이런식으로 바꿔주기
            Product.find({ _id: { $in: array } })
                .populate('writer')
                .exec((err, productInfo) => {
                    return res.status(200).json({
                        productInfo,
                        cart
                    })
                })
        }
    )
})



router.post('/successBuy', auth, (req, res) => {


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

    //history 정보 저장 
    User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { history: history }, $set: { cart: [] } },
        { new: true },
        (err, user) => {
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
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'jarod.goodwin74@ethereal.email',
            pass: 'g4Z6jmQ9EtnQNWSgK4'
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
