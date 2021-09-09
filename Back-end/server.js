const app = require('./express-app/app')
const debug = require('debug')('node-angular');
const http = require('http')

const portNumber = val =>{
    var port = parseInt(val,10)

    if(isNaN(port)){
        return val  
    }

    if(port>= 0){
        return port;
    }
    return false;
}

//Node docs https://nodejs.org/api/errors.html
//https://openclassrooms.com/en/courses/5614116-go-full-stack-with-node-js-express-and-mongodb/5656196-create-an-express-app
const execptionListener = error =>{
    if(error.syscall !== "listen"){
        throw error;
    }

    const bind =  typeof addr ==="string" ? "pipe" + addr: "port" + port
    switch (error){
        case "EACCES":
            console.log(bind + "require privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.log(bind + "address in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const listening = () =>{
    const address = server.address;
    const bind =  typeof addr ==="string" ? "pipe" + addr: "port" + port;
    debug("listening on " + bind);
};

const port =  portNumber(process.env.PORT || 3000)
app.set("port", port)


const server = http.createServer(app)
server.on('error', execptionListener);
server.on('listening', listening); 
server.listen(port, ()=>{
    console.log("listening on localhost:"+port)
})

