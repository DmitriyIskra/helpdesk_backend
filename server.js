const http = require('http');
const Koa  = require('koa');
const app = new Koa();
const uuid = require('uuid');
const path = require('path');
const { koaBody } = require('koa-body');
const fs = require('fs');
const koaStatic = require('koa-static');
const cors = require('@koa/cors');

let ticket = [{name:"Описание 1",status:"false",created:"20.06.23 16:12",id:"d3434b08-d829-4172-a1c4-475a1cc23efe"},
            {name:"Описание 2",status:"false",created:"20.06.23 16:12",id:"aa2392a8-2222-42aa-8795-8c8f52598243"}];
let ticketFull = [{name:"Описание 1",description:"Any description",status:"false",created:"20.06.23 16:12",id:"d3434b08-d829-4172-a1c4-475a1cc23efe"},
                    {name:"Описание 2",description:"Any description",status:"false",created:"20.06.23 16:12",id:"aa2392a8-2222-42aa-8795-8c8f52598243"}];


const public = path.join(__dirname, '/public');
const routeTicket = public + '\\' + 'ticket.txt';
const routeTicketFull = public + '\\' + 'ticketFull.txt';

app.use(koaStatic(public));

app.use(cors());

app.use(koaBody({
    urlencoded: true,
    multipart: true
}))

app.use(async ctx => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');
    
    const { method } = ctx.request.query;
    // console.log('method', method)
    switch (method) {
        case 'allTickets':
            ctx.response.body = ticket;
            ctx.response.status = 200;
            console.log(method)
            return;
        case 'createTicket':
            let body = ctx.request.body;
            body.id = uuid.v4();

            let shortBody = {...body};
            delete shortBody.description;

            ticketFull.push(body)
            ticket.push(shortBody)

            ctx.response.status = 200;
            ctx.response.body = 'ticket created';
            console.log(method)
            return;
        default:
            ctx.response.status = 404;
            return;
    }
});



// app.use((ctx, next) => {
//     if(ctx.request.query.method === 'createTicket') {
//         ctx.set('Access-Control-Allow-Origin', '*');

//         let body = ctx.request.body;
//         body.id = uuid.v4();
        
//         // обрабатываем файл ticketFull
//         fs.readFile(routeTicketFull, 'utf8', (err, data) => {
//             if(err) throw err;
    
//             if(data) { // в файле данные хранятся в JSON
//                 ticketFull = [];
//                 JSON.parse(data).forEach( item => {
//                     ticketFull.push(item);
//                 })
//             }
            
//             ticketFull.push(body);

//             fs.writeFile(routeTicketFull, JSON.stringify(ticketFull), (err) => {
//                 if(err) throw err;
//                 console.log('file ticketFull changed')
//             })
//         })

//         // обрабатываем файл ticket
//         fs.readFile(routeTicket, 'utf8', (err, data) => {
//             if(err) throw err;
    
//             if(data) {
//                 ticket = [];
//                 JSON.parse(data).forEach( item => {
//                     ticket.push(item);
//                 })
//             }
//             console.log(body)
//             let shortBody = {...body};
//             delete shortBody.description;
//             console.log(shortBody)
//             ticket.push(shortBody);

//             fs.writeFile(routeTicket, JSON.stringify(ticket), (err) => {
//                 if(err) throw err;
//                 console.log('file ticket changed')
//             })
//         })

        

    
//         ctx.response.body = 'server responce';
//     }
    
//     next();
// })


const server = http.createServer(app.callback());

const port = 7070;

server.listen( port, (err) => {
    if(err) {
        console.log('error - ', err);
        return;
    }

    console.log(`server is listening to ${port}`);
})