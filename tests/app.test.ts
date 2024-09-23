import request from 'supertest';
import app from '../src/index';

describe('GET /api/items', () => {
    it('should return a list of items', async () => {
        const response = await request(app).get('/api/items');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    }, 10000);

    it('sould return a filterd item by gender', async () => {
        const response = await request(app).get('/api/items/?gender=male');
        expect(response.status).toBe(200);
        response.body.forEach((item: any) => {
            expect(item.gender).toBe('male');
        });
    });

    it('should return a filterd item by age', async () => {
        const response = await request(app).get('/api/items/?age=adult');
        expect(response.status).toBe(200);
        response.body.forEach((item: any) => {
            expect(item.age).toBe('adult');
        })
    });

    it('should retun a single item by ID', async () => {
        const itemId = '66ebed9ef1c0ea89816dedb0';  
        const response = await request(app).get(`/api/items/${itemId}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', itemId);
    });

    it('should return 404 error for a non-existing item', async () => {
        const itemId = '64ebed9ef1c0ea89816dedb9';  
        const response = await request(app).get(`/api/items/${itemId}`);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Item not found');
    })
});

describe('POST /api/orders/newOrder', () => {
    it('should create a new order', async () => {
        const newOrder = getFakeOrder();
        const response = await request(app).post('/api/orders/newOrder').send(newOrder);
        expect(response.status).toBe(201);
    });
});

describe('GET /api/orders', () => {
    it('should return all orders by default', async () => {
        const response = await request(app).get('/api/orders');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        // Optionally, check if the response contains orders
    });

    it('should  filter orders by status', async () => {
        const response = await request(app).get('/api/orders?status=pending');
        expect(response.status).toBe(200);
        response.body.forEach((order: any) => {
            expect(order.status).toBe('pending');
        });
    });

    it('should filter orders by different periods correctly', async () => {
        // Test lastMonth
        let response = await request(app).get('/api/orders?period=lastMonth');
        expect(response.status).toBe(200);
        const lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        response.body.forEach((order: any) => {
            const orderDate = new Date(order.date);
            expect(orderDate.getTime()).toBeGreaterThanOrEqual(lastMonthDate.getTime());
        });

        // Test lastSixMonths
        response = await request(app).get('/api/orders?period=lastSixMonths');
        expect(response.status).toBe(200);
        const lastSixMonthsDate = new Date();
        lastSixMonthsDate.setMonth(lastSixMonthsDate.getMonth() - 6);
        response.body.forEach((order: any) => {
            const orderDate = new Date(order.date);
            expect(orderDate.getTime()).toBeGreaterThanOrEqual(lastSixMonthsDate.getTime());
        });

        // Test lastYear
        response = await request(app).get('/api/orders?period=lastYear');
        expect(response.status).toBe(200);
        const lastYearDate = new Date();
        lastYearDate.setFullYear(lastYearDate.getFullYear() - 1);
        response.body.forEach((order: any) => {
            const orderDate = new Date(order.date);
            expect(orderDate.getTime()).toBeGreaterThanOrEqual(lastYearDate.getTime());
        });

        // Test period 'all'
        response = await request(app).get('/api/orders?period=all');
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        // Optionally, check if the response contains all orders
    });
});

function getFakeOrder() {
    return {
        status: 'pending',
        orderItems: [
            {
                // id: 1,
                // orderId: 1,
                itemId: '66ebed9ef1c0ea89816dedc8',
                itemName: "Wrangler Authentics Men's Classic 5-Pocket Regular Fit Flex Jean",
                color: 'blue',
                colorPhotoUrl: './assets/clothes/2/blue/1.jpg',
                size: 'EU 41.5',
                quantity: 1,
                price: 39.99,
                totalPrice: 39.99,
                shippingCoast: 5.1,
                totalShipping: 5.1
            }
        ],
        subTotal: 39.99,
        totalShipping: 5.1,
        totalQuantity: 1,
        totalPrice: 45.09,
        date: new Date(),
    };
}
