const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());

const uri = process.env.MONGO_URI || "mongodb+srv://manmithgopari7:rintu@cluster0.wk9vzhp.mongodb.net/Speakx?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error:", err));

const questionsData = new mongoose.Schema(
  {
    id: Number,
    type: String,
    anagramType: String,
    blocks: Array,
    siblingId: String,
    solution: String,
    title: String,
    options: Array,
  },
  { collection: "datas" }
);

const question = mongoose.model("Data", questionsData);

app.get("/api/data/title/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const titleSearcher = await question.find({ title: new RegExp(title, "i") }).limit(20);
    res.json(titleSearcher);
  } catch (err) {
    res.status(500).json({ error: "Error in searching DB", message: err.message });
  }
});
app.get("/api/data/page/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const pageNumber = parseInt(page, 10);
    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({ error: "Invalid pageNumber" });
    }

    const itemsInpage = 10;
    const skip = (pageNumber - 1) * itemsInpage;
    const totalCount = await question.countDocuments();
    const pageResults = await question.find().skip(skip).limit(itemsInpage);

    if (skip >= totalCount) {
      return res.status(404).json({ error: "No data found" });
    }

    res.json({
      totalCount,
      totalPages: Math.ceil(totalCount / itemsInpage), 
      pageResults,
    });
  } catch (err) {
    res.status(500).json({ error: "Query error", message: err.message });
  }
});


app.use((err, req, res, next) => {
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

