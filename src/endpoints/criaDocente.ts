import express, { Request, Response } from "express";
import app from "../app";
import connection from "../connection";

enum ESPECIALIDADE{
    "REACT" = 1,
    "REDUX" = 2,
    "CSS" = 3,
    "TESTES" = 4,
    "TYPESCRIPT" = 5,
    "POO" = 6,
    "BACKEND" = 7
}
type criaDocenteInput = {
    id: number;
    nome: string;
    email: string;
    data_nasc: string;
    especialidades: ESPECIALIDADE[];
    turma_id: number;
  };

  app.post("/docente", async (req: Request, res: Response) => {
    let errorCode = 400;
    try {
      const input: criaDocenteInput = {
        id: req.body.id,
        nome: req.body.nome,
        email: req.body.email,
        data_nasc: req.body.data_nasc,
        especialidades: req.body.especialidades,
        turma_id: req.body.turma_id,
      };
      if (
        !input.id ||
        !input.nome ||
        !input.email ||
        !input.data_nasc ||
        input.especialidades.length < 1
      ) {
        errorCode = 422;
        throw new Error("Preencha os campos corretamente");
      }
      await connection.raw(`
      INSERT INTO DOCENTE(id, nome, email, data_nasc, es, turma_id)
      VALUES
      (${input.id},
          "${input.nome}",
          "${input.email}",
          "${input.data_nasc}",
          ${input.turma_id},
  
          )
      
      `);
      for(let especialidade of input.especialidades){
      
        await connection.raw(`
  INSERT INTO DOCENTE_ESPECIALIDADE(docente_id, especialidade_id)
  VALUES(
      ${input.id},
      ${ESPECIALIDADE[especialidade]}
      
  )
  `);
}

res.status(201).send({ message: "Criado com sucesso" });
} catch (error) {
res.status(errorCode).send({ message: error.message });
}
  });

  
  