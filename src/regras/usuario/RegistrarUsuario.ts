import Usuario from './Usuario'
import ProvedorCriptografia from './ProvedorCriptografia'
import RepositorioUsuario from './RepositorioUsuario'

export default class RegistrarUsuario {
    constructor(
        private readonly repo: RepositorioUsuario,
        private readonly cripto: ProvedorCriptografia
    ) {}

    async executar(usuario: Usuario): Promise<void> {
        const usuarioExistente = await this.repo.buscarPorEmail(usuario.email)
        if (!usuario.senha) {
            throw new Error('Senha é obrigatória');
          }
          
          const senhaCriptografada = await this.cripto.criptografar(usuario.senha);
          
        const novoUsuario: Usuario = { ...usuario, senha: senhaCriptografada, barbeiro: false }
        await this.repo.salvar(novoUsuario)
    }
}
