import {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import mongoose, { Mongoose } from 'mongoose';
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg';
export const conectaMongoDB = (handler: NextApiHandler) => 
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

        //verificar se o banco está conectado, se tiver seguir para o endpoint ou proximo middleware
        if(mongoose.connections[0].readyState){
            return handler(req, res);
        }

        //se não tiver conectado, vamos conectar
        //obter variavel de ambiente preenchida do env
        const {DB_CONEXAO_STRING} = process.env; 

        // se a env estiver vazia aborta o uso do sistema e avisa ao programador
        if(!DB_CONEXAO_STRING){
            return res.status(500).json({error: 'ENV de configuração do banco, não informada '});
        }

        mongoose.connection.on('connected', () => console.log('Banco de dados Conectado!'));
        mongoose.connection.on('error', error => console.log(`Ocorreu um erro ao conectar no banco de dados ${error}`));
        await mongoose.connect(DB_CONEXAO_STRING);

        //agora posso conectar ao endpoint, pois estou conectado ao banco
        return handler(req, res);

    }