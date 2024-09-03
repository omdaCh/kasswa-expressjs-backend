import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
import cors from 'cors'
import { IItem } from "./models/item.model";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes

// / Load items from JSON file
const dataPath = path.join(__dirname, 'data', 'database.json');
let items: IItem[] = [];

try {
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const jsonData = JSON.parse(rawData);
  items = jsonData.items;  // Assuming the JSON file has an "items" key
} catch (error) {
  console.error('Error reading or parsing JSON file:', error);
}

app.get('/api/items', (req: Request, res: Response) => {
  const { gender, age } = req.query;

  let filteredItems = items;

  if (gender) {
    filteredItems = filteredItems.filter(item => item.gender === gender);
  }

  if (age) {
    filteredItems = filteredItems.filter(item => item.age === age);
  }

  res.json(filteredItems);

});

app.get('/api/items/:id', (req: Request, res: Response) => {


  const item = items.find(item => item.id.toString() === req.params.id);


  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

app.get('/api/items/search/:searchText', (req: Request, res: Response) => {
  const  searchText  = req.params.searchText;
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchText.toLowerCase())
  );
  res.json(filteredItems);
})

app.get("/", (req: Request, res: Response) => {
  res.send("My first express typescript applicationd");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});