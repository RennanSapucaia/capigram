import { error } from 'console';
import type{NextApiRequest, NextApiResponse} from 'next'
import {conectaMongoDB} from '../../middlewares/conectaMongoDB';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import { UsuarioModel } from '../../models/UsuarioModel';

const pesquisaEndPoint = async(req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any[]>) => {
    try {
        if(req?.query?.id){
            const usuariosEncontrados = await UsuarioModel.findById(req?.query?.id);
            if(!usuariosEncontrados){
                return res.status(405).json({error : 'Usuario não encontrado'});
            }
            usuariosEncontrados.senha = null;
            return res.status(200).json(usuariosEncontrados);
        }else{
            if(req.method === 'GET'){
                const {filtro} = req.query;
                if(!filtro || filtro.length < 2){
                    return res.status(400).json({error : 'Favor informar pelo menos 2 caracteres para busca'});
                }
                const usuariosEncontrados = await UsuarioModel.find({
                    nome : {$regex : filtro, $options : 'i'}
                });
                return res.status(200).json(usuariosEncontrados);
            }
        } 
        return res.status(405).json({error : 'Metodo informado invalido'});
    } catch (e) {
        console.log(e)
        return res.status(500).json({error : 'Erro ao Buscar Usuario!'})
    }
}

export default validarTokenJWT(conectaMongoDB(pesquisaEndPoint));