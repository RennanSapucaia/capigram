import type { NextApiRequest, NextApiResponse } from "next";
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import {conectaMongoDB} from '../../middlewares/conectaMongoDB';
import { UsuarioModel } from "../../models/UsuarioModel";
import { SeguidorModel } from "../../models/seguidorModel";
import Usuario from "./Usuario";

const seguirEndPoint = async(req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) => {
    try {
        
        if(req.method === 'PUT'){
            const {userId, id} = req.query;
            const usuarioLogado = await UsuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({Error : 'Usuario logado não encontrado'});
            }
            const usuarioASerSeguido = await UsuarioModel.findById(id);
            if(!usuarioASerSeguido){
                return res.status(400).json({Error : 'Usuario a ser seguido não encontrado'});
            }
            const jaSigo = await SeguidorModel.find({usuarioId : usuarioLogado._id, usuarioSeguidoId : usuarioASerSeguido._id});
            if(jaSigo && jaSigo.length > 0){
                jaSigo.forEach(async(e : any) => await SeguidorModel.findByIdAndDelete({_id : e._id}));
                usuarioLogado.seguindo--;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);

                usuarioASerSeguido.seguidores--;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

                return res.status(200).json({msg : 'Deixou de seguir com sucesso'});
            }else{
                const seguidor = {
                    usuarioId : usuarioLogado._id,
                    usuarioSeguidoId : usuarioASerSeguido._id
                }
                await SeguidorModel.create(seguidor);

                usuarioLogado.seguindo++;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);

                usuarioASerSeguido.seguidores++;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

                return res.status(200).json({msg : 'Usuario seguido com sucesso'});
            }
        }
        return res.status(405).json({Error : 'Metodo informado invalido'});
    } catch (e) {
        console.log(e);
        return res.status(500).json({Error : 'Não foi possível seguir o usuario'});
    }
}

export default validarTokenJWT(conectaMongoDB(seguirEndPoint));