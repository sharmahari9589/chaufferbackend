import express from 'express';
import dotenv from 'dotenv'
import { connect } from 'mongoose';
import cors from "cors";

import appRoutes from './appRoutes'

const app = express();
dotenv.config()

app.use(express.json());

app.use(cors());


const PORT = process.env.SERVER_PORT;

// database connection
connect(process.env.MONGODB_URL!)
  .then(() => console.log("Database is connected"))
  .catch((err) => console.log(err));
// database connection


app.use(express.urlencoded({ extended: true }));

app.use(appRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

