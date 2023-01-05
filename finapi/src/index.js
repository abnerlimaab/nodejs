const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const costumers = [];

const verifyIfExistsAccountCPF = (request, response, next) => {
  const { cpf } = request.params;

  const costumer = costumers.find((costumer) => costumer.cpf === cpf);

  if (!costumer) {
    return response.status(400).json({ error: "Costumer not found!" });
  }

  request.costumer = costumer;

  return next();
};

const getBalance = (statement) =>
  statement.reduce(
    (balance, operation) =>
      operation.type === "credit"
        ? balance + operation.amount
        : balance - operation.amount,
    0
  );

const costumerAlreadyExists = (cpf) =>
  costumers.some((costumer) => costumer.cpf === cpf);

app.get("/account", verifyIfExistsAccountCPF, (request, response) => {
  const { costumer } = request;

  return response.json(costumer);
});

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

app.put("/account", verifyIfExistsAccountCPF, (request, response) => {
  const { name } = request.body;
  const { costumer } = request;

  costumer.name = name;

  return response.status(201).send();
});

app.delete("/account", verifyIfExistsAccountCPF, (request, response) => {
  const { costumer } = request;

  costumers.splice(costumer, 1);

  return response.status(200).json(costumers);
});

app.get("/statement", verifyIfExistsAccountCPF, (request, response) => {
  const { costumer } = request;

  return response.json(costumer.statement);
});

app.get("/statement/date", verifyIfExistsAccountCPF, (request, response) => {
  const { costumer } = request;
  const { date } = request.query;

  const statement = costumer.statement.filter(
    (statement) =>
      statement.created_at.toDateString() ===
      new Date(date + "00:00").toDateString()
  );

  return response.json(statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (request, response) => {
  const { description, amount } = request.body;

  const { costumer } = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  costumer.statement.push(statementOperation);

  return response.status(201).send();
});

app.post("/withdraw", verifyIfExistsAccountCPF, (request, response) => {
  const { costumer } = request;
  const { amount } = request.body;

  const balance = getBalance(costumer.statement);

  if (balance < amount) {
    return response.status(400).json({ error: "Insufficient funds!" });
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit",
  };

  costumer.statement.push(statementOperation);

  return response.status(201).send();
});

app.get("/balance", verifyIfExistsAccountCPF, (request, response) => {
  const { costumer } = request;

  const balance = getBalance(costumer.statement);

  return response.json(balance);
});

app.listen(3333, () => console.log("Server is running on port 3333"));
