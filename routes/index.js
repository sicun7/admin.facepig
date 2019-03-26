var express = require('express');
var router = express.Router();
var db = require("../config/db");

/* GET home page. */
router.get('/', function (req, res, next) {
  //res.sendFile(__dirname + '/pages/index.html');
  res.sendfile('public/pages/index.html');
});

router.get('/tutorial', function (req, res, next) {
  res.sendfile('public/pages/tutorial.html');
});

router.get('/edit_tutorial', function (req, res, next) {
  res.sendfile('public/pages/edit_tutorial.html');
});

router.get('/tutorial_list', function(req, res, next){
    db.query("select * from fp_tutorial",function(err,rows){
      if(err){
          res.send({code: 500, msg:' 服务器暂不可用!'});
      }else {
          res.send({code: 0, result: rows});
          updateReadcount(rows);
      }
    });
})

router.get('/tutorial_query_one/:id', function(req, res, next){
    var id = req.params.id;
    db.query("select * from fp_tutorial where id =" +id ,function(err,rows){
      if(err){
          res.send({code: 500, msg:' 服务器暂不可用!'});
      }else {
          res.send({code: 0, result: rows});
          updateReadcount(rows);
      }
    });
})

router.post('/tutorial_add', function(req, res, next){
    var name = req.body.name;
    var type =  req.body.type;
    var content =  req.body.content;
    db.query("insert into fp_tutorial(name,type,content,created_by, created_time, read_count) values('"+name+"','"+ type +"','"+ content +"','小猪', now(), 100)",function(err,rows){
        if(err){
            res.send({code: 500, msg:'新建失败'});
        }else {
          res.send({code: 0, result: 1});
        }
    });
})

router.post('/tutorial_update', function(req, res, next){
  var name = req.body.name;
  var type =  req.body.type;
  var content =  req.body.content;
  var id =  req.body.id;
  var sql = `update fp_tutorial set name = '${name}', type= ${type}, content = '${content}'  where id = ${id}`;

  console.log('sql', sql);

  db.query(sql,function(err,rows){
      if(err){
          res.send({code: 500, msg:'更新失败'});
      }else {
        res.send({code: 0, result: 1});
      }
  });
})

function updateReadcount(list){
    list.forEach(function(item){
        var sql = "update fp_tutorial set read_count = '"+ (item.read_count +1) +"'  where id = " + item.id;
        db.query(sql,function(err,rows){
          if(err){
             //console.error('更新read_count失败');
          }else {
             //console.log('更新read_count成功');
          }
        });
    });
}

router.get('/test', function (req, res, next) {
  res.render('test', {
    title: '测试内容'
  });
});

module.exports = router;