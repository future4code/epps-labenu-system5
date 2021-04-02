import express, { Request, Response } from "express";
import app from "../app";
import connection from "../connection";

app.get('/estudante/:id', async (req: Request, res: Response) => {
  let errorCode = 400
    try {
        const id = req.params.id;
        if(isNaN(Number(id))){
            errorCode = 422;
            throw new Error('Apenas valores númericos')
        }
        const result = await connection.raw(`
        SELECT ROUND(DATEDIFF("2021-01-01, data_nasc)/365) as idade
        FROM ESTUDANTE
        WHERE id = ${id};
        `);

        if(result[0].length === 0){
            errorCode = 404;
            throw new Error('Não encontrad')
        }
        res.status(200).send({estudante: result[0][0]})
    } catch (error) {
        res.status(errorCode).send({ message: error.message });
    }
})