const { Schema, model } = require('mongoose');

const Producto = new Schema({
    title: String,
    description: String,
    imageURL: String,
    public_id: String
});

module.exports = model('Producto', Producto);