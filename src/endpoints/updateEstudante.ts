import express, { Request, Response } from "express";
import app from "../app";
import connection from "../connection";

type AtualizaEstudanteInput ={
    estudante_id:number,
    turma_id:number
}

app.put("/estudante", async (req: Request, res: Response) => {
  let errorCode = 400;
  try {
      const input:AtualizaEstudanteInput ={
          estudante_id: req.body.estudante_id,
          turma_id:req.body.turma_id
      }

      await connection.raw(`
      UPDATE ESTUDANTE
      SET turma_id =${input.turma_id},
      WHERE id = ${input.estudante_id
    }
      
      `)
      res.status(200).send({message:"Atualizado com sucesso"})
  } catch (error) {
    if(error.message.includes('foreing key constraint fails')){
      errorCode = 422;
      error.message = 'Turma inexistente'
  }
    res.status(errorCode).send({ message: error.message });
  }
});
