import type {NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import nc from 'next-connect';
import {upload, uploadImagemCosmic} from '../../services/uploadImagemCosmic';
import {conectaMongoDB} from '../../middlewares/conectaMongoDB';
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import {publicacaoModel} from '../../models/publicacaoModel';
import {UsuarioModel} from '../../models/UsuarioModel';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req : any, res : NextApiResponse<RespostaPadraoMsg>) => {
        try {
            const {userId} = req.query
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({error : 'Usuario não encontrado'})
            }
            if(!req || !req.body){
                return res.status(400).json({error : 'Parametros de entrada não informado'});
            }
            const {descricao} = req?.body;

            if(!descricao || descricao.length < 2){
                return res.status(400).json({error : 'Descrição informada invalida'});
            }
            if(!req.file){
                return res.status(400).json({error : 'imagem é obrigatoria'});
            }
            const image = await uploadImagemCosmic(req);
            const publicacao = {
                idUsuario : usuario._id,
                descricao,
                foto : image.media.url,
                data : new Date()
            }
            await publicacaoModel.create(publicacao);
            return res.status(200).json({msg : 'publicação Enviada'});  
        }catch(e){
            console.log(e);
            return res.status(400).json({error : 'erro'});
        }
        
});

export const config = {
    api: {
        bodyParser : false
    }
}

export default validarTokenJWT(conectaMongoDB(handler));