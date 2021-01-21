const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const passport = require('passport');

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
        role: req.user.role,
        image: req.user.image
    });
});

router.post("/register", async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        return res.status(200).json({
            success: true
        });
    } catch (err) {
        console.log(err)
    }
});

/**
 * 로그인은 여기서 처리
 * 첫 번째 인자는 경로
 * 두 번째 인자는 커스텀 cb함수
 * cb함수를 사용한 이유는 기본 제공 옵션이 인증 요청을 처리하기에
 * 충분하지 않을 때, 성공 또는 실패를 직접 처리할 수 있도록 하기 위해서임
 */
router.post('/login', (req, res, next) => {
    console.log('클라이언트가 준 정보', req.body);
    passport.authenticate("local", (err, user, info) => {   //이 함수가 호출되면 인증에 성공
        console.log('Passport작업이 끝났어', err, user, info);
        //서버 에러
        if (err) {
            return next(err);
        }
        //유저가 없다면 passport에서 만들어 낸 msg가 info에 들어와 이를 리턴합니다.
        if (!user) {
            console.log('유저가 존재하지 않습니다.', info)
            return res.json({ msg: info });
        }
        /**
         * 커스텀 cb함수를 사용했기 때문에
         * req.logIn함수를 호출해 세션을 설정하고 응답을 보낸다.
         * 로그인 작업이 완료되면, user가 req.user에 할당된다.
         */
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.status(200).json({ loginSuccess: true })
        });
    })(req, res, next);
})

router.get("/logout", auth, async (req, res) => {
    req.logout();
    res.status(200).send({
        success: true
    });
});

module.exports = router;
