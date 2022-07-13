import type{NextApiRequest, NextApiResponse} from 'next'
import {conectaMongoDB} from '../../middlewares/conectaMongoDB';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
const endPointLogin = (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body;
        if(login === 'Adm@admin.com' &&
            senha === 'Adm123admar321'){
                return res.status(200).json({msg: 'Login Autenticado Com Sucesso'})
        }
        return res.status(400).json({error: 'Login ou senha inválido'});

    }
    return res.status(405).json({error: 'Método informado Inválido'});
}

export default conectaMongoDB(endPointLogin);