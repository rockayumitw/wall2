const express =  require('express');
const router = express.Router();
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const sizeOf = require('image-size');
const upload = require('../service/image');
const { ImgurClient } = require('imgur');
const {isAuth,generateSendJWT} = require('../service/auth');
const uploadController = require('../controllers/upload');

router.post('/', isAuth, upload, handleErrorAsync(async (req, res, next) => uploadController.upload(req, res, next)));

module.exports = router;