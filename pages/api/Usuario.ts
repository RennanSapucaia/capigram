import type { NextApiRequest, NextApiResponse } from "next";
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";


const usuarioEndPoint = (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    return res.status(200).json({msg: 'Usuario Autenticado Com Sucesso!'});
}

export default validarTokenJWT(usuarioEndPoint);
