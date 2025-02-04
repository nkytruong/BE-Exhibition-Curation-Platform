import app from "./app";

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("📌 DATABASE_URL:", process.env.DATABASE_URL);
  console.log("📌 PORT:", process.env.PORT);
});
