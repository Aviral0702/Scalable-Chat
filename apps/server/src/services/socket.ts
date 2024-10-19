import { Server } from "socket.io";
import Redis from 'ioredis'; 
import dotenv from 'dotenv';

dotenv.config();
//we need to connections from redis one is to publish and another is to subscribe 
const pub = new Redis({
    host:process.env.REDIS_HOST,
    port:19107,
    username:process.env.REDIS_USERNAME,
    password:process.env.REDIS_PASSWORD  
});
const sub = new Redis({
    host:process.env.REDIS_HOST,
    port:19107,
    username:process.env.REDIS_USERNAME,
    password:process.env.REDIS_PASSWORD
});

class SocketService{
    private _io: Server; //instance of the Socket Server
    constructor(){
        console.log('Init Socket Server...');
        this._io = new Server({
            cors:{
                allowedHeaders: ['*'],
                origin: '*',
            }
        });
        sub.subscribe("MESSAGES");
    }

    public initListeners(){
        const io = this.io;
        console.log("initialize socket listeners");
        io.on('connect',(socket)=> {
            console.log('New socket connected',socket.id);
            
            socket.on('event:message', async ({message}: {message: String})=>{
                console.log('Message received:',message);
                //publish the message to the redis channel
                await pub.publish("MESSAGES",JSON.stringify({message}));
            })
        })
        sub.on('message',(channel,message)=>{
            if(channel === 'MESSAGES'){
                console.log('New message arrived',message);
                io.emit('message',message);
            }
        })
    }

    get io() {
        return this._io;
    }
}
export default SocketService;