var dbConfig = {
    synchronize: false,
};

switch (process.env.NODE_ENV) {
    case 'development':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['**/*.entity.js'],
            migrationsRun: true, //to make sure that migrations are ran before every single test we execute (this property is going to make sure that all of our different migrations get ran when we are starting up our db for each individual test)
        });
        break;
    case 'test':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'test.sqlite',
            entities: ['**/*.entity.ts']
        });
        break;
    case 'production':
        Object.assign(dbConfig, {
            type: 'postgres',
            url: process.env.DATABASE_URL, //DATABASE_URL will be provided by Heroku
            migrationsRun: true,
            entities: ['**/*.entity.js'], //telling typeorm where our different entities are
            ssl: {
                rejectUnauthorized: false, //for Heroku
            }
        });
        break;
    default:
        throw new Error('unknown enviroment');
}