import type { NextApiRequest, NextApiResponse } from "next";
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import {conectaMongoDB} from '../../middlewares/conectaMongoDB';
import { UsuarioModel } from "../../models/UsuarioModel";
import { publicacaoModel } from "../../models/publicacaoModel";

const feedEndPoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) =>{
    try {
        if(req.method === 'GET'){
            if(req?.query?.id){
                const Usuario = await UsuarioModel.findById(req?.query?.id);
                if(!Usuario){
                    return res.status(400).json({error: 'Usuario Não Encontrado'});
                }
                const Publicacoes = await publicacaoModel
                    .find({idUsuario : Usuario._id})
                    .sort({data : -1});      
                return res.status(200).json(Publicacoes);     
            }
            
        }
        return res.status(405).json({error: 'metodo invalido'});
    } catch (e) {
        console.log(e);
    }
    return res.status(400).json({error: 'Não foi possivel obter o feed'});
}

export default validarTokenJWT(conectaMongoDB(feedEndPoint));