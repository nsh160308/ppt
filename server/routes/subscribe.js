const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");




//=================================
//            subscribe
//=================================

router.post('/subscribeNumber', (req, res) => {

    Subscriber.find({ userTo: req.body.userTo })
        .exec((err, subscribe) => {
            if(err) return res.send(err)
            return res.status(200).json({ success: true, subscribeNumber: subscribe.length })
        })

})

router.post('/subscribed', (req, res) => {
    
    

    Subscriber.find({ userTo: req.body.userTo, userFrom: req.body.userFrom })
        .exec((err, subscribe) => {
            
            //console.log(subscribe.length);

            if(err) return res.send(err)
            
            let result = false
            //subscribe길이가 0이 아니라면 이사람을 구독하고 있는것
            //그렇지 않다면 구독하고 있지 않은 것
            if(subscribe.length !== 0) {
                result = true
            }
            res.status(200).json({ success:true, subscribed: result })
        })
})

//구독
router.post('/subscribe', (req, res) => {

    const subscribe = new Subscriber(req.body)

    subscribe.save((err, doc) => {
        if(err) return res.json({ success: false, err})
        res.status(200).json({ success: true })
    })
})

//구독 취소
router.post('/unSubscribe', (req, res) => {

    Subscriber.findOneAndDelete({ userTo: req.body.userTo, userFrom: req.body.userFrom })
        .exec((err, doc) => {
            if(err) res.status(400).json({ success: false, err })
            return res.status(200).json({ success: true, doc })
        })
})


module.exports = router;
