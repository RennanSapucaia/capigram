import type { NextApiRequest, NextApiResponse } from "next";
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import {conectaMongoDB} from '../../middlewares/conectaMongoDB';
import { publicacaoModel } from "../../models/publicacaoModel";
import { UsuarioModel } from "../../models/UsuarioModel";

const likeEndpoint = async(req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) =>{
    try {
        if(req.method === 'PUT'){
            const {id} = req?.query;
            const publicacao = await publicacaoModel.findById(id);

            if(!publicacao){
                return res.status(400).json({Error : 'Publicação não encontrada'});
            }

            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);

            if(!usuario){
                return res.status(400).json({Error : 'Usuario não encontrado'});
            }

            const IndexDoUsuarioLike = publicacao.like.findIndex((e : any)=> e.toString() === usuario._id.toString());
            if(IndexDoUsuarioLike != -1){
                publicacao.like.splice(IndexDoUsuarioLike, 1);
                await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg : 'publicação descurtida com sucesso'});
            }else{
                publicacao.like.push(usuario._id);
                await publicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg : 'publicação curtida com sucesso'});
            }
        }
        return res.status(405).json({Error : 'Metodo informado invalido'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({Error : 'Não foi possivel dar o like'});
    }
}

export default validarTokenJWT(conectaMongoDB(likeEndpoint));