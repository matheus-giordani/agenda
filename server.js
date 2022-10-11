require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("conexão feita");
    app.emit("pronto");
  })
  .catch((err) => console.log(err));

const session = require("express-session");
const mongoStore = require("connect-mongo");
const flashMenssage = require("connect-flash");

const routes = require("./routes");
const path = require("path");
const helmet = require("helmet");
const csrf = require("csurf");
const {middlewareGlobal, checkCrsfError, sendCsrfMiddleware} = require("./src/middlewares/middlewares");

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "public")));

const sessionOptions = session({
  secret: "qX6Qt+N!14j*n2N",
  store: mongoStore.create({ mongoUrl: process.env.CONNECTION_STRING }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true },
});

app.use(sessionOptions);
app.use(flashMenssage());

app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.use(csrf());

app.use(middlewareGlobal);
app.use(checkCrsfError);
app.use(sendCsrfMiddleware)
app.use(routes);

app.on("pronto", () => {
  app.listen(3000, () => {
    console.log("Acessar http://localhost:3000");
    console.log("Servidor executando na porta 3000");
  });
});
