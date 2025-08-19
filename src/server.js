import app from "./app.js";
import { config } from "./config/env.js";

const PORT = config.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Welcome to the E-Commerce API! 🚀');
});