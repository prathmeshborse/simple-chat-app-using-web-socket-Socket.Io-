import {io} from "socket.io-client";

import React from 'react';

const Ws = () => {
    return io("http://localhost:3000", {
        transports: ["websocket"], // reduces the overhead of polling and improves performance by using WebSocket as the primary transport mechanism.
        withCredentials: true,  // allows the client to send credentials (such as cookies or authorization headers) along with the WebSocket connection request, enabling secure communication between the client and server.
    });
}

export default Ws;