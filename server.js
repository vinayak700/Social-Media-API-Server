import app from "./app.js";
import connection from "./config/mongoose.js";

app.listen(8000, () => {
    console.log('Serving is running on http://localhost:8000');
    connection();
})