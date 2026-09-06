// @ts-nocheck
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Users & Auth Mock APIs
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ message: 'Success', user });
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const user = await prisma.user.create({
      data: { email, password, name, role: role || 'Customer' }
    });
    res.json({ message: 'User created', user });
  } catch (error) {
    res.status(400).json({ error: 'User already exists or missing data' });
  }
});

// Trucks
app.get('/api/trucks', async (req, res) => {
  const trucks = await prisma.truck.findMany({ include: { vendor: true } });
  res.json(trucks);
});

// Bookings
app.post('/api/bookings', async (req, res) => {
  const { customerId, pickup, destination } = req.body;
  try {
    const booking = await prisma.booking.create({
      data: { customerId, pickup, destination, status: 'Pending' }
    });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

app.get('/api/bookings/:role/:id', async (req, res) => {
  const { role, id } = req.params;
  try {
    let bookings;
    if (role === 'customer') {
      bookings = await prisma.booking.findMany({ where: { customerId: id }, include: { truck: true } });
    } else if (role === 'vendor') {
      bookings = await prisma.booking.findMany({
        where: { truck: { vendorId: id } },
        include: { customer: true, truck: true }
      });
    } else {
      bookings = await prisma.booking.findMany();
    }
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch bookings' });
  }
});

app.listen(port, () => {
  console.log(`TruckAPI running on http://localhost:${port}`);
});
