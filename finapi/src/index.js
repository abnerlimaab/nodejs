const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const costumers = [];

const costumerAlreadyExists = (cpf) =>
  costumers.some((costumer) => costumer.cpf === cpf);

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  if (costumerAlreadyExists(cpf)) {
    return response.status(400).json({ error: "Costumer already exists!" });
  }

  costumers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return response.status(201).send();
});

app.get("/statement/:cpf", (request, response) => {
  const { cpf } = request.params;

  const costumer = costumers.find((costumer) => costumer.cpf === cpf);

  if (!costumer) {
    return response.status(400).json({ error: "Costumer not found!" });
  }

  return response.json(costumer.statement);
});

app.listen(3333, () => console.log("Server is running on port 3333"));