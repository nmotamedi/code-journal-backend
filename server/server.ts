/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express from 'express';
import { ClientError, errorMiddleware } from './lib/index.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

app.get('/api/entries', async (req, res, next) => {
  try {
    const sql = `
    select *
    from "entries";
    `;
    const resp = await db.query(sql);
    res.json(resp.rows);
  } catch (err) {
    next(err);
  }
});

app.get('/api/entries/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    if (!Number.isInteger(+entryId)) {
      throw new ClientError(400, 'Entry Id must be an integer.');
    }
    const sql = `
    select *
    from "entries"
    where "entryId" = $1;
    `;
    const param = [entryId];
    const resp = await db.query(sql, param);
    const [entry] = resp.rows;
    if (!entry) {
      throw new ClientError(404, `Entry ${entryId} not Found`);
    }
    res.json(entry);
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
