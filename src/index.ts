import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from 'cors'
import mongoose, { Schema } from 'mongoose';
import MngOrder from './mng-schema/order_schema'
import { MngItem } from "./mng-schema/item_shema";


dotenv.config();

const app: Express = express();
export default app;
const port = process.env.PORT || 8080;

const mongoDbUri = process.env.MONGODB_URI;

if (!mongoDbUri) {
  throw new Error('MongoDB URI is not defined in environment variables  ')
}

// Connect to MongoDB
mongoose.connect(mongoDbUri)
  .then(() => console.log('[MongoDB] Connected successfully'))
  .catch((err: any) => console.error('[MongoDB] Connection error:', err));

app.use(cors()); // Enable CORS for all routes
app.use(express.json());


app.get('/api/items', async (req: Request, res: Response) => {
  const { gender, age } = req.query;
  try {
    const query: any = {};
    if (gender) {
      query.gender = gender;
    }

    if (age) {
      query.age = age;
    }

    const items = await MngItem.find(query);

    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/items/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid item ID format.' });
  }

  try {
    const item = await MngItem.findById(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching item by id:', error);
    res.status(500).json({ message: 'Failed to fetch item from database' });
  }
});

app.get('/api/items/search/:searchText', async (req: Request, res: Response) => {
  const searchText = req.params.searchText;
  try {
    const filteredItems = await MngItem.find({
      $or: [
        { name: { $regex: searchText, $options: 'i' } },
        { description: { $regex: searchText, $options: 'i' } },
        { category: { $regex: searchText, $options: 'i' } }
      ]
    });

    res.json(filteredItems);
  } catch (error) {
    console.error('Error while searching items:', error);
    res.status(500).json({ error: 'An error occurred while searching for items.' });
  }
});

app.post('/api/orders/newOrder', async (req: Request, res: Response) => {
  try {
    let newOrder = new MngOrder(req.body);

    const savedOrder = await newOrder.save();

    // Respond with the saved order
    res.status(201).json(savedOrder);
  }
  catch (error) {
    console.error('Error saving the order:', error);
    res.status(500).json({ message: 'Error saving the order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const status = req.query.status;
    const period = req.query.period;

    let query: Record<string, any> = {};

    if (status) {
      query.status = status;
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
          fromDate = null;
          break;
      }

      if (fromDate) {
        query.date = { $gte: fromDate, $lte: currentDate };
      }
    }

    const orders = await MngOrder.find(query); // Fetch filtered data from MongoDB
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error ' });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("My first express typescript applicationd");
});

// Start the server only when not in test mode
if (require.main === module) {
  app.listen(port, () => {
    console.log(`[server]: Server is running`);
  });
}