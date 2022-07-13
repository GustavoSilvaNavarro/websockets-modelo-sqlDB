import { connectionSQL } from '../db/db.js'

class Chats {
    constructor(connectionSQL) {
        this._connection = connectionSQL;
        this._dbName = process.env.MDB_TABLE_NAME_CHATS;
    };

    //CREATE DATABASE
    async createDataBaseChats() {
        try {
            const chatTableExist = await this._connection.schema.hasTable(this._dbName);

            if(!chatTableExist) {
                //Create table
                await this._connection.schema.createTable(this._dbName, chat_table => {
                    chat_table.increments('id').unique().notNullable().primary()
                    chat_table.string('email', 50).notNullable()
                    chat_table.timestamp('created_at').defaultTo(this._connection.fn.now())
                    chat_table.string('date', 50).notNullable()
                    chat_table.text('message')
                });
                
                console.log('Chat Table Created!');
            };
        } catch (err) {
            const error = new Error(err.message);
            return error;
        };
    };

    //TABLE EXIST
    async chatTableExist() {
        try {
            return await this._connection.schema.hasTable(this._dbName);
        } catch (err) {
            const error = new Error(err.message);
            return error;
        };
    };

    //INSERT DATA
    async insertDataChat(chat) {
        try {
            await this._connection(this._dbName).insert(chat);
        } catch (err) {
            const error = new Error(err.message);
            return error;
        };
    };

    //GET DATA
    async getChats() {
        try {
            return await this._connection(this._dbName).select('email', 'date', 'message');
        } catch (err) {
            const error = new Error(err.message);
            return error;
        };
    };

    //Update a product
    async updateChat(id, data) {
        try {
            const product = data;
            product.id = id;
            await this._connection(this._dbName).where({ id }).update(data);
        } catch (err) {
            const error = new Error(err.message);
            return error;
        };
    };

    //Delete a product
    async deleteChat(id) {
        try {
            await this._connection(this._dbName).where({ id }).del();
        } catch (err) {
            const error = new Error(err.message);
            return error;
        };
    };
};

export default new Chats(connectionSQL);