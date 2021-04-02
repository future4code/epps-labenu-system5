import express, { Request, Response } from "express";
import app from "../app";
import connection from "../connection";

type criaEstudanteInput = {
  id: number;
  nome: string;
  email: string;
  data_nasc: string;
  hobbies: string[];
  turma_id: number;
};

app.post("/estudante", async (req: Request, res: Response) => {
  let errorCode = 400;
  try {
    const input: criaEstudanteInput = {
      id: req.body.id,
      nome: req.body.nome,
      email: req.body.email,
      data_nasc: req.body.data_nasc,
      hobbies: req.body.hobbies,
      turma_id: req.body.turma_id,
    };
    if (
      !input.id ||
      !input.nome ||
      !input.email ||
      !input.data_nasc ||
      input.hobbies.length < 1
    ) {
      errorCode = 422;
      throw new Error("Preencha os campos corretamente");
    }
    await connection.raw(`
    INSERT INTO ESTUDANTE(id, nome, email, data_nasc, hobbies, turma_id)
    VALUES
    (${input.id},
        "${input.nome}",
        "${input.email}",
        "${input.data_nasc}",
        ${input.turma_id},

        )
    
    `);
    for (let hobby of input.hobbies) {
      const idPassatempo = Math.floor(Math.random() * 10000000);
      await connection.raw(`
INSERT INTO PASSATEMPO(id, nome)
VALUES(
   ${idPassatempo},
    "${hobby}"
)
`);
      await connection.raw(`
INSERT INTO ESTUDANTE_PASSATEMPO(estudante_id, passatempo_id)
VALUES(
    ${input.id},
    ${idPassatempo}
)
`);
    }
    res.status(201).send({ message: "Criado com sucesso" });
  } catch (error) {
    res.status(errorCode).send({ message: error.message });
  }
});
