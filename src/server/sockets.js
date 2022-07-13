import productsCommands from '../models/product-model.js';
import chatComands from '../models/chat-model.js';

//WEB SOCKETS EVENTS
export const socketsEvents = io => {
    io.on('connection', socket => {
        console.log('New Connection!!!', socket.id);

        socket.on('userInfo', async user => {
            socket.emit('usuario', user);

            try {
                const tableExist = await productsCommands.tableExist();
                const chatTableExist = await chatComands.chatTableExist();


                if(tableExist) {
                    const oldProductsDB = await productsCommands.getProducts();
        
                    if(oldProductsDB.length > 0) {
                        io.emit('allProducts', oldProductsDB);
                    };
                };

                if(chatTableExist) {
                    const oldMessData = await chatComands.getChats();
            
                    if(oldMessData.length > 0) {
                        io.emit('server:messages', oldMessData);
                    };
                };
            } catch (err) {
                console.log(err.message);
            };    
        });

        socket.on('product', async product => {
            try {
                await productsCommands.createDataBaseProducts();
                await productsCommands.insertData(product);
                const allProductsData = await productsCommands.getProducts();
                io.emit('allProducts', allProductsData);
            } catch (err) {
                const error = new Error(err.message);
                return error;
            };
        });

        socket.on('client:newMessage', async mess => {
            try {
                await chatComands.createDataBaseChats();

                //Insert value
                await chatComands.insertDataChat(mess);
                
                const allMessagesData = await chatComands.getChats();
                io.emit('server:messages', allMessagesData);
            } catch (err) {
                const error = new Error(err.message);
                return error;
            };
        });
    });
};