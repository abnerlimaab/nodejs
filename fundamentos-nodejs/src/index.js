const express = require("express");

const app = express();

app.use(express.json());

app.get("/cursos", (request, response) => {
  const { query } = request;
  console.log(query);

  return response.json(["Curso 1", "Curso 2", "Curso 3"]);
});

app.post("/cursos", (request, response) => {
  const { body } = request;
  console.log(body);

  return response.json(["Curso 1", "Curso 2", "Curso 3", "Curso 4"]);
});

app.put("/cursos/:id", (request, response) => {
  const { id } = request.params;
  console.log(id);

  response.json(["Curso 6", "Curso 2", "Curso 3", "Curso 4"]);
});

app.patch("/cursos/:id", (request, response) => {});

app.delete("/cursos/:id", (request, response) => {});

app.listen(3333, () => {
  console.info("Server is running on port 3333");
});
