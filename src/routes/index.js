const { Router } = require('express');
const router = Router();

const Producto = require('../models/Producto');
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const fs = require('fs-extra');

router.get('/', async (req, res) => {
    const productos = await Producto.find();
    //console.log(photos);
    res.render('images', {productos});
});

router.get('/images/add', async (req, res) => {
    const productos = await Producto.find();
    res.render('image_form', {productos});
});

router.post('/images/add', async (req, res) => {
    console.log(req.body);
    const { title, description } = req.body;
    console.log(req.file);
    const result = await cloudinary.v2.uploader.upload(req.file.path);
    console.log(result);
    
    const newProducto = new Producto({
        title: title,
        description: description,
        imageURL: result.url,
        public_id: result.public_id
    });

    await newProducto.save();
    await fs.unlink(req.file.path);
    res.redirect('/');
});

router.get('/images/delete/:producto_id', async (req, res) => {
    const { producto_id }= req.params;
    const producto = await Producto.findByIdAndDelete(producto_id);
    const result = await cloudinary.v2.uploader.destroy(producto.public_id);
    console.log(result);
    res.redirect('/images/add')
});

module.exports = router;