const http = require('http');
const Koa  = require('koa');
const app = new Koa();
const uuid = require('uuid');
const path = require('path');
const { koaBody } = require('koa-body');
const fs = require('fs');
const koaStatic = require('koa-static');
const cors = require('@koa/cors');

let ticket = [];
let ticketFull = [];


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

    let body;
    let index;
    let id;

    switch (method) {
        case 'allTickets':
            ctx.response.body = ticket;
            ctx.response.status = 200;
            return;
        case 'createTicket':
            body = ctx.request.body;
            body.id = uuid.v4();

            let shortBody = {...body};
            delete shortBody.description;

            ticketFull.push(body)
            ticket.push(shortBody)

            ctx.response.status = 200;
            ctx.response.body = 'ticket created';
            return;
        case 'changeStatus':
            id = ctx.request.body.id;

            index = ticket.findIndex( item => item.id === id );
            ticket[index].status = ticket[index].status === 'false'? 'true': 'false';

            index = ticketFull.findIndex( item => item.id === id );
            ticketFull[index].status = ticketFull[index].status === 'false'? 'true': 'false';

            ctx.response.status = 200;
            ctx.response.body = 'status changed';
            return;
        case 'ticketById': 
            id = ctx.request.query.id;

            index = ticketFull.findIndex( item => item.id === id );
            ctx.response.body = ticketFull[index];

            ctx.response.status = 200;
            return;
        case 'ticketEdit':
            body = ctx.request.body; 

            index = ticket.findIndex( item => item.id === body.id);
            ticket[index].name = body.name;
            ticket[index].description = body.description;
            ticket[index].status = body.status;
            ticket[index].created = body.created;

            index = ticketFull.findIndex( item => item.id === body.id);
            ticketFull[index].name = body.name;
            ticketFull[index].description = body.description; 
            ticketFull[index].status = body.status; 
            ticketFull[index].created = body.created;

            ctx.response.body = 'ticket changed'; 
            ctx.response.status = 200;
            return;
        case 'DELETE':
            id = ctx.request.query.id;
         
            index = ticket.findIndex( item => item.id === id);
            ticket.splice(index, 1);
            

            let indexFull = ticketFull.findIndex( item => item.id === id);
            ticketFull.splice(indexFull, 1);
  
            ctx.response.status = 200;
            ctx.response.body = `ticket ${id} deleted`;
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