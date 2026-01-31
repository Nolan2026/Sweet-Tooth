import express from "express";
import cors from "cors";
import items from "./routers/landingRoutes/items.js"
import auth from "./routers/landingRoutes/auth.js"
import uploadRoutes from "./routers/uploadsRoutes/upload.js"    

const app = express();
const PORT = process.env.PORT || 5016;

app.use(cors());
app.use(express.json());

// Routes
app.use("/items", items)
app.use("/auth", auth)

// serve uploaded images
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/uploads", uploadRoutes);


app.get("/", (req, res) => {
    console.log("Welcome to home");
    res.send("Welcome to home");
});


app.listen(PORT, () => {
    console.log(`Server Started on port: ${PORT}`);
});
