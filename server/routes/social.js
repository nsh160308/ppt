const express = require('express');
const router = express.Router();

//=================================
//             Social
//=================================

router.post('/google', (req, res) => {
    console.log(req.body);
})


module.exports = router;
