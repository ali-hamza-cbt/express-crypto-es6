import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

const PORT = process.PORT || 3000;

app.listen(PORT, ()=> console.log(`🚀 Server running on port ${PORT}`))
