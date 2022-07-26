import mongoose, {Schema} from "mongoose";

const publicacaoSchema = new Schema({
    idUsuario : {type : String, required : true},
    descricao : {type : String, required : true},
    foto : {type : String, required : true},
    data : {type : Date, required : true},
    like : {type : Array, required : true, default : []},
    comentarios : {type : Array, required : true, default : []},
})
export const publicacaoModel = (mongoose.models.publicacoes || mongoose.model('publicacoes', publicacaoSchema));