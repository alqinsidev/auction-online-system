import {io} from 'socket.io-client'

const URL = import.meta.env.VITE_WS_ENDPOINT
const connection = io(URL)

const SocketHelper = {
    getConnection: ()=> connection
}

export default SocketHelper