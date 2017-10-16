// var Models = require('../models/models.js');
// require('sequelize');

exports.homePage = function(req, res) {
  res.render('homepage', { title: 'RefManager'});
};