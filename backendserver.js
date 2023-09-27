const express = require('express')
const app = express()
const dic = {'fab': 5}
const cheerio = require("cheerio");
const axios = require("axios");
var fs = require("fs");
var queries = require('./queries.js');
var amazon = require('./amazonscraper.js')


app.use((req, res, next) => {
    console.log("req received from client");
    console.log(req.originalUrl);
    const request = req.originalUrl.slice(1);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (Object.keys(req.query).length){
        console.log('query')
        const dic = req.query;
        console.log(dic)
        if (dic.keywords){
           queries.findExactKeyword(dic.keywords).then((result) => {
                if (result.length > 0){
                    if (dic.remove === 'true'){
                        queries.removeKeyword(dic.keywords).then((result) => {console.log('successfully deleted keyword');});
                    }
                }
                else{
                    if (dic.remove != 'true'){
                        queries.addKeyword(dic.keywords).then((result) => {console.log('successfully added keyword');});
                    }
                }
           })
            
        }
       
        if (dic.amazon === 'true'){
            console.log('go fuck yourself');
            queries.getKeywords().then((result)=>{
                for (const b in result){
                    //amazon.runAmazon(result[b].content)
                    amazon.test(result[b].content);
                }
                res.send(JSON.stringify({'response': 'success'}));
              });
        }
        if (dic.search){
            console.log('returning search!');
            console.log(dic.search);
            queries.findExactProduct(dic.search).then((result)=>{
                if (result.length > 0){
                    console.log(result[0]['created']);
                    console.log(new Date(result[0]['created']).toLocaleString())
                    res.send(JSON.stringify(result));
                    console.log('sent');
                }
            })
        }
    }
    else{
        if (request =="keywords"){
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          console.log('keyword files requested!');
          var keywords = {'keywords':[]}
          queries.getKeywords().then((result)=>{
            for (const b in result){
                keywords['keywords'].push(result[b].content);
            }
            res.send(JSON.stringify(keywords));
          });
        }
        else{
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            console.log(`${request} files requested!`);
            queries.showNonNull(request).then((result)=>{
                //console.log(result);
                res.send(JSON.stringify(result));
            })
            }
    }

});                 
app.listen(3000, () => console.log('Node.js app listening on port 3000.'))
