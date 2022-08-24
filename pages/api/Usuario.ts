import type { NextApiRequest, NextApiResponse } from "next";
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import {conectaMongoDB} from '../../middlewares/conectaMongoDB';
import {UsuarioModel} from '../../models/UsuarioModel';
import nc from 'next-connect';
import {upload,uploadImagemCosmic} from '../../services/uploadImagemCosmic';

const handler = nc()
    .use(upload.single('file'))
    .put(async(req : any, res : NextApiResponse<RespostaPadraoMsg>) => {
        try {
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);

            if(!usuario){
                return res.status(400).json({error: 'usuario não encontrado'});
            }

            const {nome} = req.body;
            if(nome && nome.length > 2){
                usuario.nome = nome;
            }

            const {file} = req;
            if(file && file.originalname){
                const image = await uploadImagemCosmic(req);
                if(image && image.media && image.media.url){
                    usuario.avatar = image.media.url;
                }
            }
            
            await UsuarioModel.findByIdAndUpdate({_id : usuario._id}, usuario);
            return res.status(200).json({msg: 'usuario alterado com sucesso'});
            
        } catch (e) {
            console.log(e)
            return res.status(400).json({error: 'Não foi possivel atualizar usuario'});
        }
    })
    .get(async( req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
        try {
            const {userId} = req?.query;
            const Usuario = await UsuarioModel.findById(userId);
            Usuario.senha = null;
            return res.status(200).json(Usuario);
        } catch (e) {
            console.log(e);
        }
        return res.status(400).json({error: 'Não foi possivel receber os dados'}); 
    })

export const config = {
    api: {
        bodyParser : false
    }
}

export default validarTokenJWT(conectaMongoDB(handler));
