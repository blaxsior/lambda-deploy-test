import Knex from 'knex';
// import 'dotenv/config';
import { Keyword, NewsSource } from './type';
// console.log(process.env);
const knex = Knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT!)
  }
});

export const keyword = knex<Keyword>('keyword');
export const news_source = knex<NewsSource>('news_source');