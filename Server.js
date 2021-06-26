const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
var db;
var s = 0;
MongoClient.connect('mongodb://localhost:27017/FootWear',(err,database)=>{
    if(err) return console.log(err)
    db = database.db('FootWear')
    app.listen(5000,()=>{
        console.log('Listening at port 5000')
    })
})
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

//rendering homepage
app.get('/', (req,res)=>{
    db.collection('Ladies').find().toArray((err,result)=>{
        if(err) return console.log(err)
        //loading homepage
        res.render('homepage.ejs',{data:result})
    })
})

app.get('/addProduct', (req,res)=>{
    res.render('add.ejs')
})
app.get('/updateStock', (req,res)=>{
    res.render('update.ejs')
})
app.get('/deleteProduct', (req,res)=>{
    res.render('delete.ejs')
})

app.get('/stockDetails', (req,res)=>{
    db.collection('Ladies').find().toArray((err,result)=>{
        if(err) return console.log(err)
        //loading stock_details
        res.render('stock_details.ejs',{data:result})
    })
})
app.get('/ProductAdditionForm', (req,res)=>{
    res.render('Addproduct.ejs')
})
app.get('/UpdateForm', (req,res)=>{
    res.render('Updatestock.ejs')
})
app.get('/DeleteForm', (req,res)=>{
    res.render('Deleteproduct.ejs')
})

app.post('/AddData',(req,res)=>{
    db.collection('Ladies').save(req.body, (err,result)=>{
        if(err) return console.log(err)
        res.redirect('/stockDetails')
    })
})
app.post('/update',(req,res)=>{
    db.collection('Ladies').find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i<result.length; i++)
        {
            if(result[i].pid == req.body.pid)
            {
                s = result[i].stock
                break
            }
        }
        db.collection('Ladies').findOneAndUpdate({pid: req.body.pid},{
            $set: {stock: parseInt(s) + parseInt(req.body.stock)}}, {sort: {_id:-1}},(err,result)=>{
                if(err) res.send(err)
                console.log(req.body.pid + ' stock updated')
                res.redirect('/stockDetails')
        })
    })
})
app.post('/delete',(req,res)=>{
    db.collection('Ladies').findOneAndDelete({pid : req.body.pid}, (err,result)=>{
        if(err) return console.log(err)
        res.redirect('/stockDetails')
    })
})