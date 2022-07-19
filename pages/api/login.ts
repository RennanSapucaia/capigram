import type{NextApiRequest, NextApiResponse} from 'next'
import {conectaMongoDB} from '../../middlewares/conectaMongoDB';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import md5 from 'md5';
import { UsuarioModel } from '../../models/UsuarioModel';

const endPointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body;
        const usuariosEncontrados = await UsuarioModel.find({email: login, senha: md5(senha)});
        if(usuariosEncontrados && usuariosEncontrados.length > 0){
            const usuarioEncontrado = usuariosEncontrados[0];
            return res.status(200).json({msg: `Usuario ${usuarioEncontrado.nome} Autenticado Com Sucesso`});
        }
        return res.status(400).json({error: 'Login ou senha inválido'});

    }
    return res.status(405).json({error: 'Método informado Inválido'});
}

export default conectaMongoDB(endPointLogin);