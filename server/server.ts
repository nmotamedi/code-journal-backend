/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import 'dotenv/config';
import pg, { Client } from 'pg';
import express from 'express';
import { ClientError, errorMiddleware } from './lib/index.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
app.use(express.json());

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

app.post('/api/entries', async (req, res, next) => {
  try {
    const { title, notes, photoUrl } = req.body;
    const sql = `
    insert into "entries" ("title", "photoUrl", "notes")
    values ($1, $2, $3)
    returning *;
  `;
    if (!title) {
      throw new ClientError(400, 'Please enter a title.');
    }
    if (!photoUrl) {
      throw new ClientError(400, 'Please enter URL for the photo.');
    }
    if (!notes) {
      throw new ClientError(400, 'Please enter some notes.');
    }

    const params = [title, photoUrl, notes];
    const resp = await db.query(sql, params);
    const [newEntry] = resp.rows;
    res.status(201).json(newEntry);
  } catch (err) {
    next(err);
  }
});

app.put(`/api/entries/:entryId`, async (req, res, next) => {
  try {
    const { entryId } = req.params;
    const { title, photoUrl, notes } = req.body;
    const sql = `
      update "entries"
      set "title" = $1,
      "photoUrl" = $2,
      "notes" = $3
      where "entryId" = $4
      returning *;
    `;
    if (!title) {
      throw new ClientError(400, 'Please enter a title.');
    }
    if (!photoUrl) {
      throw new ClientError(400, 'Please enter URL for the photo.');
    }
    if (!notes) {
      throw new ClientError(400, 'Please enter some notes.');
    }
    if (!Number.isInteger(+entryId)) {
      throw new ClientError(400, 'Entry Id must be an integer.');
    }
    const params = [title, photoUrl, notes, entryId];
    const resp = await db.query(sql, params);
    const [updatedEntry] = resp.rows;
    if (!updatedEntry) throw new ClientError(404, 'Entry does not exist.');
    res.status(200).json(updatedEntry);
  } catch (err) {
    next(err);
  }
});

app.delete('/api/entries/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    if (!Number.isInteger(+entryId)) {
      throw new ClientError(400, 'Entry Id must be an integer.');
    }
    const sql = `
    delete from "entries"
      where "entryId" = $1
      returning *;
    `;
    const params = [entryId];
    const resp = await db.query(sql, params);
    const [deletedEntry] = resp.rows;
    if (!deletedEntry)
      throw new ClientError(404, `Entry ${entryId} does not exist.`);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
});
