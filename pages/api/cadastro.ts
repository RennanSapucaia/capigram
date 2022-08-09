import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type {CadastroReq} from '../../types/CadastroReq';
import {UsuarioModel} from '../../models/UsuarioModel';
import { conectaMongoDB } from '../../middlewares/conectaMongoDB';
import md5 from 'md5';
import {upload,uploadImagemCosmic} from '../../services/uploadImagemCosmic';
import nc from 'next-connect';

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) =>{
        const usuario = req.body as CadastroReq;
          
        if(!usuario.nome || usuario.nome.length < 2){
                return res.status(400).json({error: 'Nome Invalido!'});
            }
    
        if(!usuario.email || usuario.email.length < 5
            || !usuario.email.includes('@') 
            || !usuario.email.includes('.')){
            return res.status(400).json({error: 'Email Invalido'});
        }
    
        if(!usuario.senha || usuario.senha.length < 8){
            return res.status(400).json({error: 'Senha invalida'});
        } 
    
            //validação se ja existe usuario com mesmo email
        const usuariosComEmailsIguais = await UsuarioModel.find({email: usuario.email});
        if(usuariosComEmailsIguais && usuariosComEmailsIguais.length > 0){
            return res.status(400).json({error: 'Já existe uma conta com o email informado'});
        }

        const image = await uploadImagemCosmic(req);
    
        //salvar no banco de dados
        const UsuarioASerSalvo = {
            nome : usuario.nome,
            email : usuario.email,
            senha : md5(usuario.senha),
            avatar : image?.media?.url
        }   
        await UsuarioModel.create(UsuarioASerSalvo);
        return res.status(200).json({msg: 'Usuario Cadastrado com Sucesso'});
});
    
export const config = {
    api: {
        bodyParser: false
    }
}

export default conectaMongoDB(handler);