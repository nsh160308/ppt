const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    nickname: {
        type: String,
        maxlength: 10,
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minglength: 5
    },
    role: {
        type: Number,
        default: 0
    },
    cart: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    },
    image: String,
    tokens: Array,
    googleId: String,
    facebookcId: String,
    kakaoId: String,
    naverId: String,
})

userSchema.pre('save', function (next) {
    var user = this;
    console.log('save전 pre에 들어 있는 user정보', user);

    if (user.isModified('password')) {
        console.log('비밀번호 변경됨')
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash
                next()
            })
        })
    } else {
        console.log('비밀번호 변경안됨');
        next();
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    console.log(`비밀번호 : ${plainPassword}가 맞는지 확인합니다.`);
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        console.log(`비밀번호가 맞습니다. ${isMatch}를 콜백함수에게 전달합니다.`);
        cb(null, isMatch)
    })
}
const User = mongoose.model('User', userSchema);

module.exports = { User }