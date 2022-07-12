import connectionDB from '../db/db.js'

class Products {
    constructor(connectionDB) {
        this._connection = connectionDB;
    };

    //CREATE DATABASE
    async createDataBase() {
        try {
            const tableExist = await this._connection.schema.hasTable(process.env.MDB_TABLE_NAME_ECOM);

            if(!tableExist) {
                //Create table
                await this._connection.schema.createTable(process.env.MDB_TABLE_NAME_ECOM, productsTable => {
                    productsTable.increments('id').unique().notNullable().primary()
                    productsTable.string('name', 50).notNullable()
                    productsTable.timestamp('created_at').defaultTo(this._connection.fn.now())
                    productsTable.float('price').notNullable()
                    productsTable.integer('stock').notNullable()
                    productsTable.text('url')
                });

                console.log('Table Created!');

                //this._connection.destroy();
            };
        } catch (err) {
            const error = new Error(err.message);
            return error;
        };
    };

    //INSERT DATA
    async insertData(product) {
        try {
            await this._connection(process.env.MDB_TABLE_NAME_ECOM).insert(product);
            //this._connection.destroy();
        } catch (err) {
            const error = new Error(err.message);
            return error;
        };
    };

    //GET DATA
    async getProducts() {
        try {
            const allProductsData = await this._connection(process.env.MDB_TABLE_NAME_ECOM).select('name', 'price', 'stock', 'url');
            //this._connection.destroy();
            return allProductsData
        } catch (err) {
            const error = new Error(err.message);
            return error;
        };
    };
};

export default new Products();