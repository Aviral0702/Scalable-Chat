import { Server } from "socket.io";
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

    }

    public initListeners(){
        const io = this.io;
        console.log("initialize socket listeners");
        io.on('connect',(socket)=> {
            console.log('New socket connected',socket.id);
            
            socket.on('event:message', async ({message}: {message: String})=>{
                console.log('Message received:',message);
            })
        })
    }

    get io() {
        return this._io;
    }
}
export default SocketService;