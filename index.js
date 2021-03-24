const fs = require('fs');
const http = require('http');
const url = require('url');

function ReplaceTemp(orignalhtml,laptop){
    let output = orignalhtml.replace(/{%PRODUCTNAME%}/g,laptop.productName);
        output = output.replace(/{%CPU%}/g,laptop.cpu);
        output = output.replace(/{%IMG%}/g,laptop.image);
        output = output.replace(/{%RAM%}/g,laptop.ram);
        output = output.replace(/{%STORAGE%}/g,laptop.storage);
        output = output.replace(/{%PRICE%}/g,laptop.price);
        output = output.replace(/{%DESCRIPTION%}/g,laptop.description);
        output = output.replace(/{%SCREEN%}/g,laptop.screen);
        output = output.replace(/{%ID%}/g,laptop.id);
        return output;
}

const json = fs.readFileSync(`${__dirname}/data/data.json`,'utf-8');
const laptopdata = JSON.parse(json);

const server = http.createServer((req,res)=> {
    
    const pathName = url.parse(req.url,true).pathname;
    const id = url.parse(req.url,true).query.id;
    
    ////PRODUCTS OVERVIEW
    if(pathName === '/' || pathName === '/products'){
        res.writeHead(200,{'content-type':'text/html'});
        fs.readFile(`${__dirname}/public/overview.html`,'utf-8',(err,data) => {

            let overviewout = data;

            fs.readFile(`${__dirname}/public/overview-card.html`,'utf-8',(err,data) => {

                const cardout = laptopdata.map(el => ReplaceTemp(data,el)).join('');
                overviewout = overviewout.replace('{%CARDS%}',cardout);
                res.end(overviewout);
            });
        });
    }
    /////PRODUCT DETAILS
    else if(pathName==='/laptop' && id < laptopdata.length){
        res.writeHead(200,{'content-type':'text/html'});
        fs.readFile(`${__dirname}/public/product-page.html`,'utf-8',(err,data) => {
        const laptop = laptopdata[id];
        const output = ReplaceTemp(data,laptop);
        res.end(output);
        });
    }
    else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName)){
        fs.readFile(`${__dirname}/data/img${pathName}`,(err,data) => {
            res.writeHead(200,{'content-type':'image/jpg'});
             res.end(data);
        });
    }
    else{
        res.end('<h1>URL not found</h1>')
    }

    
});
server.listen(1337);
console.log('Server running')

