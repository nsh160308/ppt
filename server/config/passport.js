const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
// const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth20');\
const moment = require('moment');
const config = require('../config/key');
const { User } = require("../models/User");

/**
 * serializeUser
 * 방금 전에 로그인 성공시 실행되는 done(null, user)에서 user.id를 전달받아
 * 세션에 저장한다. 세션이 있어야 페이지 이동 시 로그인 정보가 유지 된다.
 * done으로 넘겨주는 user.id가 deserializeUser의 첫 번째 파라미터가 되기 때문에
 * 둘의 타입은 항상 일치해야 한다. 
 * 만약, serializeUser에서 user전체를 넘겼다면 deserializeUser 에서도 user전체를 받아야 된다는 겁니다.
 * 여기서는 id만 받았기때문에 id만 받았으면 req.user를 자체적으로 만들 수 없기 때문에
 * 
 */
passport.serializeUser((user, done) => {    //Strategy 성공 시 호출
    console.log('여기에다가 user정보를 줄듯?', user);
    done(null, user.id);    //여기의 user.id가 deserializeUser의 첫 번째 파라미터로 이동
});
/**
 * deserializeUser는 실제 서버로 들어오는 요청마다 세션 정보를 실제 DB의 데이터와 비교
 * 첫 번째 인자를 가지고 User 콜렉션에서 해당 id를 가지고 유저 정보를 찾은 뒤에
 * done의 두 번째 인자를 req.user에 저장하고 요청을 처리할 때 유저의 정보를
 * req.user를 통해서 넘겨준다. 하지만, 여기에선 아무런 처리 과정 없이 그냥 넘겨주도록 했다.
 * 결론적으로 로그인 성공 시, deserializeUser가 페이지 이동 시 마다 user정보를 req.user에게 전달합니다.
 */
passport.deserializeUser((id, done) => {    //파라미터 id는 serializeUser의 done의 인자 user.id를 받음
    User.findById(id)
        .then(user => {
            console.log('findById', user);
            done(null, user);   //여기의 user가 req.user에 담긴다.
        });
});

/**
 * 이메일과 비밀번호를 사용하여 로그인
 * Passport는 Strategy(전략)을 이용해서 사용해야 됩니다.
 * LocalStrategy의 옵션은 
 * usernameField, passwordField, session, passReqToCallback 이 있습니다.
 * usernameField, passwordField는 어떤 폼 필드로부터 이메일과 비밀번호를 전달 받을 지 설정하는 옵션입니다.
 * session은 세션을 사용할 지 안할 지 선택합니다.
 * passReqToCallback은 true로 해두면 뒤의 cb함수가 (req, email, password, done) => {};
 * 로 바뀌면서 email 파라미터 앞에 req 파라미터가 추가됩니다. 
 * req를 통해 express의 req객체에 접근할 수 있습니다.
 * 
 * body에 데이터가 {email: "test1@gmail.com", password: "123123"} 이렇게 온다면
 * 뒤의 cb함수의 email이 "test1@gmail.com", password가 "123123"이 됩니다.
 */
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
    console.log('제출된 email', email)
    console.log('제출된 password', password)
    /**
     * 이메일과 비밀번호 값이 들어오면 이 cb함수가 실행됩니다.
     * 이메일에 해당되는 유저를 찾는데 유저가 없다면,
     * 해당 이메일을 찾을 수 없다는 에러 메세지를 보냅니다.  
     */
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            console.log('유저가 없습니다.')
            return done(null, false, { msg: `${email}을 찾을 수 없습니다.` });
        }
        //구글 로그인 같은 경우 내부에 암호를 가질 수 없기 때문에 이 부분이 필요합니다.
        if (!user.password) {
            return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' });
        }
        /**
         * 유저가 있다면, 비밀번호를 비교하는데 비교 과정에서 서버 에러가 나면
         * done(err)로 에러를 리턴합니다. 
         * 비밀번호가 맞을 경우 done(null, user)로 user객체를 전송합니다.
         * 비밀번호가 틀렸다면 done(null, flase, {msg: '에러메세지'})로 메세지를 전송합니다.
         */
        console.log('유저가 있습니다.')
        user.comparePassword(password, (err, isMatch) => {
            if (err) { return done(err); }
            if (isMatch) {
                console.log('비밀번호가 맞습니다.')
                return done(null, user);
            }
            return done(null, false, { msg: '비밀번호 오류입니다.' });
        });
    });
    /**
     * done(err, success, msg)
     * 첫 번째 파라미터 => DB조회 시 발생하는 서버 에러를 넣는 곳 
     * (무조건 실패하는 경우에만 사용됩니다.)
     * 
     * 두 번째 파라미터 => 성공했을 때, retrun할 값을 넣는 곳 성공했다면 
     * 첫 번째 인자는 당연히 null이여야 됩니다.
     * 
     * 세 번째 파라미터 => 사용자가 임의로 실패를 만들고 싶을 때 사용 
     * (예를 들어서 비밀번호가 틀렸을 경우 틀렸다는 에러 메세지를 표현하고 싶을 때)
     */
}));

/**
 * Google로 로그인
 */
const googleStrategyConfig = new GoogleStrategy({
    clientID: config.googleClientId,
    clientSecret: config.googleClientSecret,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
}, (req, accessToken, refreshToken, params, profile, done) => {
    console.log('req.user', req.user)
    if (req.user) {
        User.findOne({ google: profile.id }, (err, existingUser) => {
            if (err) { return done(err); }
            if (existingUser && (existingUser.id !== req.user.id)) {
                done(err);
            } else {
                User.findById(req.user.id, (err, user) => {
                    if (err) { return done(err); }
                    user.google = profile.id;
                    user.tokens.push({
                        kind: 'google',
                        accessToken,
                        accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
                        refreshToken,
                    });
                    user.name = user.name || profile.displayName;
                    user.image = user.image || profile._json.picture;
                    user.save((err) => {
                        done(err, user);
                    });
                });
            }
        });
    } else {
        User.findOne({ google: profile.id }, (err, existingUser) => {

            if (err) { return done(err); }
            if (existingUser) {
                return done(null, existingUser);
            }
            User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
                if (err) { return done(err); }
                if (existingEmailUser) {
                    done(err);
                } else {
                    const user = new User();
                    user.email = profile.emails[0].value;
                    user.google = profile.id;
                    user.tokens.push({
                        kind: 'google',
                        accessToken,
                        accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
                        refreshToken,
                    });
                    user.name = user.name || profile.displayName;
                    user.image = user.image || profile._json.picture;
                    user.save((err) => {
                        done(err, user);
                    });
                }
            });
        });
    }
});
passport.use('google', googleStrategyConfig);

const facebookStrategyConfig = new FacebookStrategy({
    clientID: config.facebookClientId,
    clientSecret: config.facebookClientSecret,
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true, // req 파라미터 추가시켜줌
    profileFields: ['id', 'emails', 'name']
}, (req, accessToken, refreshToken, params, profile, done) => {
    //accessToken, refreshToken => 페이스북 API를 사용할 수 있는 토큰 전달
    //profile => 간단한 페이스북 사용자 정보
    console.log('req.user', req.user)
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('params', params);
    console.log('profile', profile);
    
    if (req.user) {
        console.log('재시도면 여기?');
        User.findOne({ facebook: profile.id }, (err, existingUser) => {
            if (err) { return done(err); }
            if (existingUser && (existingUser.id !== req.user.id)) {
                done(err);
            } else {
                User.findById(req.user.id, (err, user) => {
                    if (err) { return done(err); }
                    user.facebook = profile.id;
                    user.tokens.push({
                        kind: 'facebook',
                        accessToken,
                        accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
                        refreshToken,
                    });
                    user.name = user.name || profile.displayName;
                    user.image = user.image || profile._json.picture;
                    user.save((err) => {
                        done(err, user);
                    });
                });
            }
        });
    } else {
        console.log('처음 시도된 로그인이면 여기');
        User.findOne({ facebook: profile.id }, (err, existingUser) => {
            if (err) { return done(err); }
            if (existingUser) {
                return done(null, existingUser);
            }
            User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
                if (err) { return done(err); }
                if (existingEmailUser) {
                    done(err);
                } else {
                    const user = new User();
                    user.email = profile.emails[0].value;
                    user.facebook = profile.id;
                    user.tokens.push({
                        kind: 'facebook',
                        accessToken,
                        accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
                        refreshToken,
                    });
                    user.name = user.name || profile.displayName;
                    user.image = user.image || profile._json.picture;
                    user.save((err) => {
                        done(err, user);
                    });
                }
            });
        });
    }
})
passport.use('facebook', facebookStrategyConfig);

const kakaoStrategyConfig = new KakaoStrategy({
    clientID: 'bc86bae8af36328762100c9d701b3baa',
    callbackURL: '/auth/kakao/callback',
    passReqToCallback: true, // req 파라미터 추가시켜줌
}, (req, accessToken, refreshToken, params, profile, done) => {
    console.log('req.user', req.user);
    console.log('refreshToken', refreshToken);
    console.log('accessToken', accessToken);
    console.log('profile', profile);
    console.log('email', profile._json.kakao_account.email);
    console.log('params', params);

    
    if (req.user) {
        console.log('재시도면 여기?');
        User.findOne({ kakao: profile.id }, (err, existingUser) => {
            if (err) { return done(err); }
            if (existingUser && (existingUser.id !== req.user.id)) {
                done(err);
            } else {
                User.findById(req.user.id, (err, user) => {
                    if (err) { return done(err); }
                    user.kakao = profile.id;
                    user.tokens.push({
                        kind: 'kakao',
                        accessToken,
                        accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
                        refreshToken,
                    });
                    user.name = user.name || profile.displayName;
                    user.image = user.image || profile._json.picture;
                    user.save((err) => {
                        done(err, user);
                    });
                });
            }
        });
    } else {
        console.log('처음 시도된 로그인이면 여기');
        User.findOne({ kakao: profile.id }, (err, existingUser) => {
            if (err) { return done(err); }
            if (existingUser) {
                return done(null, existingUser);
            }
            User.findOne({ email: profile._json.kakao_account.email }, (err, existingEmailUser) => {
                if (err) { return done(err); }
                if (existingEmailUser) {
                    done(err);
                } else {
                    const user = new User();
                    user.email = profile._json.kakao_account.email;
                    user.kakao = profile.id;
                    user.tokens.push({
                        kind: 'kakao',
                        accessToken,
                        accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
                        refreshToken,
                    });
                    user.name = user.name || profile.displayName;
                    user.image = user.image || profile._json.picture;
                    user.save((err) => {
                        done(err, user);
                    });
                }
            });
        });
    }
});
passport.use('kakao', kakaoStrategyConfig);




