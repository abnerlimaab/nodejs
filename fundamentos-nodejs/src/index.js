const express = require("express");

const app = express();

app.get("/cursos", (_, response) => {
  return response.json(["Curso 1", "Curso 2", "Curso 3"]);
});

app.post("/cursos", (request, response) => {});

app.put("/cursos/:id", (request, response) => {});

app.patch("/cursos/:id", (request, response) => {});

app.delete("/cursos/:id", (request, response) => {});

app.listen(3333, () => {
  console.info("Server is running on port 3333");
});
