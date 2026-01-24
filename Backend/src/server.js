import express from "express";
import cors from "cors";
import items from "./routers/landingRoutes/items.js"
import auth from "./routers/landingRoutes/auth.js"

const app = express();
const PORT = process.env.PORT || 5016;

app.use(cors());
app.use(express.json());

// Routes
app.use("/items", items)
app.use("/auth", auth)


app.get("/", (req, res) => {
    console.log("Welcome to home");
    res.send("Welcome to home");
});

// Landing APIs Endpoints

// Admin APIs Endpoints

app.listen(PORT, () => {
    console.log(`Server Started on port: ${PORT}`);
});
