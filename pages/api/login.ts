import type{NextApiRequest, NextApiResponse} from 'next'

export default (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body;
        if(login === 'Adm@admin.com' &&
            senha === 'Adm123admar321'){
                return res.status(200).json({msg: 'Login Autenticado Com Sucesso'})
        }
        return res.status(400).json({erro: 'Login ou senha inválido'});

    }
    return res.status(405).json({erro: 'Método informado Inválido'});
}