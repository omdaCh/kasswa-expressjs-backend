import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fs from 'fs';
import path from 'path';
import cors from 'cors'
import { IItem } from "./models/item.model";
import { Order } from "./models/order.model";
import { json } from "stream/consumers";

dotenv.config();

const app: Express = express();
export default app;
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// / Load items from JSON file
const dataPath = path.join(__dirname, 'data', 'database.json');

console.log("__dirname = "+__dirname);
let items: IItem[] = [];
let orders: Order[] = [];

try {
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const jsonData = JSON.parse(rawData);
  console.log('database.json content = ' + JSON.stringify(jsonData));
  items = jsonData.items;  // Assuming the JSON file has an "items" key
  orders = jsonData.orders;
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
  const searchText = req.params.searchText;
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchText.toLowerCase())
  );
  res.json(filteredItems);
});

app.get('/api/items', (req: Request, res: Response) => {
  const { gender, age, _page = 1, _limit = 5 } = req.query;

  let filteredItems = items;

  // Filter by gender and age
  if (gender) {
    filteredItems = filteredItems.filter(item => item.gender === gender);
  }

  if (age) {
    filteredItems = filteredItems.filter(item => item.age === age);
  }

  // Paginate results
  const startIndex = ((Number(_page) - 1) * Number(_limit));
  const endIndex = startIndex + Number(_limit);
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  res.json(paginatedItems);
});

app.post('/api/orders/newOrder', (req: Request, res: Response) => {

  let newOrder: Order = req.body;
  newOrder.id = orders.length;

  orders.push(newOrder);
  try {
    fs.writeFileSync(dataPath, JSON.stringify({ items, orders }, null, 2))
    res.status(201).json(newOrder);
  }
  catch {
    res.status(500).json({ message: 'Error saving the order ' })
  }


});

app.get('/api/orders', (req: Request, res: Response) => {
  const status = req.query.status as string;  // Accessing query params
  const period = req.query.period as string;
  let filteredOrders = orders;
  if (status) {
    filteredOrders = filteredOrders.filter(order => order.status === status);
  }

  // Date filter logic
  if (period) {
    const currentDate = new Date();
    let fromDate: Date | null = new Date();

    switch (period) {
      case 'lastMonth':
        fromDate.setMonth(currentDate.getMonth() - 1);
        break;
      case 'lastSixMonths':
        fromDate.setMonth(currentDate.getMonth() - 6);
        break;
      case 'lastYear':
        fromDate.setFullYear(currentDate.getFullYear() - 1);
        break;
      case 'all':
        fromDate = null;  // No date filtering if "all" is selected
        break;
    }

    if (fromDate) {
      filteredOrders = filteredOrders.filter(order => {
        if (!order.date) {
          return false; // Skip if no date exists
        }
        const orderDate = new Date(order.date);  // Parse the ISO date from the order
        return orderDate >= fromDate && orderDate <= currentDate;
      });
    }
  }

  res.json(filteredOrders);
});


app.get("/", (req: Request, res: Response) => {
  res.send("My first express typescript applicationd");
});


// Start the server only when not in test mode
if (require.main === module) {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}