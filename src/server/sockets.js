import connectionDB from '../db/db.js';
import productsCommands from '../models/product-model.js';

//WEB SOCKETS EVENTS
export const socketsEvents = io => {
    io.on('connection', socket => {
        console.log('New Connection!!!', socket.id);

        socket.on('userInfo', async user => {
            socket.emit('usuario', user);

            try {
                const tableExist = await connectionDB.schema.hasTable(process.env.MDB_TABLE_NAME_ECOM);
                const chatTableExist = await connectionDB.schema.hasTable(process.env.MDB_TABLE_NAME_CHATS);


                if(tableExist) {
                    const oldProductsDB = await connectionDB(process.env.MDB_TABLE_NAME_ECOM).select('name', 'price', 'stock', 'url');
        
                    if(oldProductsDB.length > 0) {
                        io.emit('allProducts', oldProductsDB);
                    };
                };

                if(chatTableExist) {
                    const oldMessData = await connectionDB(process.env.MDB_TABLE_NAME_CHATS).select('email', 'date', 'message');
            
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
                const tableExist = await connectionDB.schema.hasTable(process.env.MDB_TABLE_NAME_ECOM);

                if(!tableExist) {
                    //Create table
                    await connectionDB.schema.createTable(process.env.MDB_TABLE_NAME_ECOM, products_table => {
                        products_table.increments('id').unique().notNullable().primary()
                        products_table.string('name', 50).notNullable()
                        products_table.timestamp('created_at').defaultTo(connectionDB.fn.now())
                        products_table.float('price').notNullable()
                        products_table.integer('stock').notNullable()
                        products_table.text('url')
                    });

                    console.log('Table Created!');
                };

                //Insert value
                await connectionDB(process.env.MDB_TABLE_NAME_ECOM).insert(product);

                
                const allProductsData = await connectionDB(process.env.MDB_TABLE_NAME_ECOM).select('name', 'price', 'stock', 'url');
                io.emit('allProducts', allProductsData);

            } catch (err) {
                const error = new Error(err.message);
                return error;
            };
        });

        socket.on('client:newMessage', async mess => {
            try {
                const chatTableExist = await connectionDB.schema.hasTable(process.env.MDB_TABLE_NAME_CHATS);
                
                if(!chatTableExist) {
                    //Create table
                    await connectionDB.schema.createTable(process.env.MDB_TABLE_NAME_CHATS, chat_table => {
                        chat_table.increments('id').unique().notNullable().primary()
                        chat_table.string('email', 50).notNullable()
                        chat_table.timestamp('created_at').defaultTo(connectionDB.fn.now())
                        chat_table.string('date', 50).notNullable()
                        chat_table.text('message')
                    });
                    
                    console.log('Table Created!');
                };

                //Insert value
                await connectionDB(process.env.MDB_TABLE_NAME_CHATS).insert(mess);
                
                const allMessagesData = await connectionDB(process.env.MDB_TABLE_NAME_CHATS).select('email', 'date', 'message');
                io.emit('server:messages', allMessagesData);

            } catch (err) {
                const error = new Error(err.message);
                return error;
            };
        });
    });
};