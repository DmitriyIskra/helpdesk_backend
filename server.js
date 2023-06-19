const http = require('http');
const Koa  = require('koa');
const app = new Koa();
const uuid = require('uuid');
const path = require('path');
const { koaBody } = require('koa-body');
const fs = require('fs');
const { error } = require('console');

let ticket = [];
let ticketFull = [];

const public = path.join(__dirname, '/public');
const routeTicket = public + '\\' + 'ticket.txt';
const routeTicketFull = public + '\\' + 'ticketFull.txt';

app.use(koaBody({
    urlencoded: true,
    multipart: true
}))

app.use((ctx, next) => {
    if(ctx.request.method !== 'OPTIONS') { // это значит что запрос не GET или POST
        next();

        return;
    }

    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST')

    ctx.response.status = 204; // это корректное поведение для такого рода запросов

    next();
})

app.use((ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');

    console.log(ctx.request.query.method)
    if(ctx.request.query.method === 'allTickets') {
        fs.readFile(routeTicket, 'utf8', (err, data) => {
            if(err) throw err;
            console.log(data)
            ctx.response.body = 'data';
        })
    }
    ctx.response.body = 'data';
    console.log('kjbvjhbvhbvbjvhbjhvbdfhbvjhdfbvjdvjfb')
    next();
})

app.use((ctx, next) => {
    if(ctx.request.query.method === 'createTicket') {
        ctx.set('Access-Control-Allow-Origin', '*');

        let body = ctx.request.body;
        body.id = uuid.v4();

        
        fs.readFile(routeTicket, 'utf8', (err, data) => {
            if(err) throw err;
    
            if(data) {
                ticket = [];
                JSON.parse(data).forEach( item => {
                    ticket.push(item);
                })
            }
            
            body.id = uuid.v4();
            ticket.push(body);

            fs.writeFile(routeTicket, JSON.stringify(ticket), (err) => {
                if(err) throw err;
                console.log('file ticket changed')
            })
        })

        fs.readFile(routeTicketFull, 'utf8', (err, data) => {
            if(err) throw err;
    
            if(data) {
                ticketFull = [];
                JSON.parse(data).forEach( item => {
                    ticketFull.push(item);
                })
            }
            
            let shortBody = body;
            delete shortBody.description;
            ticketFull.push(shortBody);

            fs.writeFile(routeTicketFull, JSON.stringify(ticketFull), (err) => {
                if(err) throw err;
                console.log('file ticketFull changed')
            })
        })

        

    
        ctx.response.body = 'server responce';
    }
    
    next();
})


const server = http.createServer(app.callback());

const port = 7070;

server.listen( port, (err) => {
    if(err) {
        console.log('error - ', err);
        return;
    }

    console.log(`server is listening to ${port}`);
})