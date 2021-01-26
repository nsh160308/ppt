const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const NaverStrategy = require('passport-naver').Strategy;
const { User } = require('../models/User');
const config = require('../config/key');
const moment = require('moment');

passport.serializeUser((user, done) => {
    //console.log('Strategy성공', user);
    if(user) {
        done(null, user._id);
    } else {
        done(null, false);
    }
})
passport.deserializeUser((_id, done) => {
    //console.log('serializeUser가 준 정보', _id);
    User.findById(_id)
        .then(user => {
            //console.log('유저가 있어', user);
            done(null, user);
        })
})

//로컬 로그인
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => {
    console.log('제출된 이메일 ', email);
    console.log('제출된 비밀번호', password);
    /**
     * 이메일과 비밀번호 값이 들어오면 콜백함수 실행
     * 이메일에 해당하는 유저를 찾고 유저가 없다면,
     * 해당 이메일을 찾을 수 없다는 에러 메세지 발생
     */
    User.findOne({ email: email.toLowerCase() }, (err, existingUser) => {
        //서버 에러
        if(err) return done(err);
        //유저가 없다면
        if(!existingUser) {
            console.log('해당하는 유저가 없습니다.');
            return done(null, false, { msg: `${email}에 해당하는 유저를 찾을 수 없습니다.` })
        }
        //소셜 로그인 같은 경우 내부에 암호를 가질 수 없다.
        if(!existingUser.password) {
            return done(null, false, { msg: '계정을 제공하는 업체에서 로그인이 정상적으로 처리되었습니다. 비밀번호를 설정하고 싶으시다면 개인 프로필에서 설정해주세요.'});
        }
        /**
         * 유저가 있다면, 비밀번호 비교
         * 비교 과정에서 에러가 나면 done(err)
         * 비밀번호가 맞다면 done(null, user) user인스턴스 전달
         * 비밀번호가 틀렸다면 done(null, false, { msg: '에러메세지' }) 전달
         */
        console.log('해당하는 유저가 있습니다.');
        existingUser.comparePassword(password, (err, isMatch) => {
            //비교중에 에러 발생
            if(err) return done(err);
            //비교에 성공했다면
            if(isMatch) {
                console.log('비밀번호가 맞습니다!');
                return done(null, existingUser);//local콜백한테 전달됨
            }
            //isMatch가 false
            return done(null, false, { msg: '비밀번호가 틀렸습니다.' });
        })
    })
}))

//구글 로그인
const googleStrategyConfig = new GoogleStrategy({
    clientID: config.googleClientId,
    clientSecret: config.googleClientSecret,
    callbackURL: `/auth/google/callback`,
    passReqToCallback: true,
}, (req, accessToken, refreshToken, params, profile, done) => {
    console.log('accessToken', accessToken);//이걸 받아야 profile정보가 나오고
    console.log('refreshToken', refreshToken);//이걸 받아야 params정보가 나온다.
    console.log('params: ', params);//params 안에 accessToken있음
    console.log('profile: ', profile);
    //DB에서 중복된 이메일이 있는지 확인
    //에러솔루션 1. 로직문제는 아님
    //에러솔루션 2. 헬멧문제도 아님
    //에러솔루션 3. 백틱 및 미들웨어 순서도 아님
    //해결 : 오탈자였다... app.get여야되는데 app.use 하아..ㅋ
    User.findOne({ googleId: profile.id }, (err, existingUser) => {
        if(err) return done(err);
        if(existingUser) {
            return done(null, existingUser);
        }
        //중복된 이메일
        User.findOne({ email: profile.emails[0].value }, (err, existingUser) => {
            if(err) return done(err);
            //유저 존재
            if(existingUser) {
                return done(err);
            } else {
                const newUser = new User();
                newUser.email = profile.emails[0].value;
                newUser.googleId = profile.id;
                newUser.tokens.push({
                    kind: 'Google-Account',
                    accessToken,
                    accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
                    refreshToken
                });
                newUser.name = profile.displayName;
                newUser.image = profile.photos[0].value;

                newUser.save((err, createdUser) => {
                    console.log('신규회원 정보', createdUser);
                    done(err, createdUser);
                })
            }
        })
    })
})
passport.use('google', googleStrategyConfig);

//페이스북 로그인
const facebookStrategyConfig = new FacebookStrategy({
    clientID: config.facebookClientId,
    clientSecret: config.facebookClientSecret,
    callbackURL: config.facebookCallbackUrl,
    passReqToCallback: true, // req 파라미터 추가시켜줌
    profileFields: ['id', 'emails', 'name']
}, (req, accessToken, refreshToken, params, profile, done) => {
    console.log('accessToken', accessToken);//이걸 받아야 profile정보가 나오고
    console.log('refreshToken', refreshToken);//이걸 받아야 params정보가 나온다.
    console.log('params: ', params);//params 안에 accessToken있음
    console.log('profile: ', profile);
    User.findOne({ facebook: profile.id }, (err, existingUser) => {
        if(err) return done(err);
        if(existingUser) {
            console.log('여기')
            return done(null, existingUser);
        }
        //중복된 이메일
        User.findOne({ email: profile.emails[0].value }, (err, existingUser) => {
            if(err) return done(err);
            //유저 존재
            if(existingUser) {
                return done(err);
            } else {
                const newUser = new User();
                newUser.email = profile.emails[0].value;
                newUser.facebookId = profile.id;
                newUser.tokens.push({
                    kind: 'Facebook-Account',
                    accessToken,
                    accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
                    refreshToken
                });
                newUser.name = profile.displayName ? profile.displayName : profile._json.last_name + profile._json.first_name;
                newUser.image = `http://gravatar.com/avatar/${moment().unix()}?d=identicon`

                newUser.save((err, createdUser) => {
                    console.log('신규회원 정보', createdUser);
                    done(err, createdUser);
                })
            }
        })
    })
})
passport.use('facebook', facebookStrategyConfig);

//카카오 로그인
const kakaoStrategyConfig = new KakaoStrategy({
    clientID: config.kakaoClientId,
    callbackURL: config.kakaoCallbackUrl,
    passReqToCallback: true, // req 파라미터 추가시켜줌
}, (req, accessToken, refreshToken, params, profile, done) => {
    User.findOne({ kakaoId: profild.id }, (err, existingUser) => {
        if(err) done(err);
        if(existingUser) {
            done(err, existingUser);
        } else {
            const newUser = new User();
            newUser.email = profile._json.kakao_account.email;
            newUser.kakaoId = profile.id;
            newUser.tokens.push({
                kind: 'Kakao-Account',
                accessToken,
                accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
                refreshToken
            });
            newUser.name = profile.displayName;
            newUser.image = profile._json.picture;

            newUser.save((err, createdUser) => {
                console.log('신규회원 정보', createdUser);
                done(err, createdUser);
            })
        }
    })
})
passport.use('kakao', kakaoStrategyConfig);


//네이버 로그인
const naverStrategyConfig = new NaverStrategy({
    clientID: config.naverClientId,
    clientSecret: config.naverClientSecret,
    callbackURL: config.naverCallbackUrl,
    passReqToCallback: true, // req 파라미터 추가시켜줌
}, (req, accessToken, refreshToken, params, profile, done) => {
    User.find({ naverId: profile.id }, (err, existingUser) => {
        if(err) return done(err);
        if(existingUser) {
            done(err, existingUser);
        } else {
            User.findOne({ naverId: profile.id }, (err, existingUser) => {
                if(err) return done(err);
                if(existingUser) {//기존에 구글로 가입했던 사람입니다.
                    return done(null, existingUser);
                } else {//신규 이메일이고 googleId도 없습니다.
                    const newUser = new User();
                    newUser.email = profile.emails[0].value;
                    newUser.naverId = profile.id;
                    newUser.tokens.push({
                        kind: 'Naver-Account',
                        accessToken,
                        accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
                        refreshToken
                    });
                    newUser.name = profile.displayName;
                    newUser.image = profile._json.picture;

                    newUser.save((err, createdUser) => {
                        console.log('신규회원 정보', createdUser);
                        done(err, createdUser);
                    })
                }
            })
        }
    })
})
passport.use('naver', naverStrategyConfig);

