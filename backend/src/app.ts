import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000', // Adjust as needed
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

import authRoutes from './routes/auth.routes';

// Routes
app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
