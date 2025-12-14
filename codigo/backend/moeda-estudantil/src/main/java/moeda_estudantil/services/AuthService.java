package moeda_estudantil.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;

import moeda_estudantil.models.Aluno;
import moeda_estudantil.models.Empresa;
import moeda_estudantil.repository.AlunoRepository;
import moeda_estudantil.repository.EmpresaRepository;
import moeda_estudantil.views.LoginDTO;
import moeda_estudantil.views.LoginResponse;

@Validated
@Service
public class AuthService {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Value("${auth.token.placeholder:token-falso-temporario}")
    private String placeholderToken;

    public LoginResponse login(@Validated LoginDTO dto) {
        final String email = dto.login();
        final String senha = dto.senha();

        System.out.println("Tentando login com e-mail: " + email);

        Aluno aluno = alunoRepository.findByEmailIgnoreCase(email)
                .orElse(null);
        if (aluno != null) {
            if (!encoder.matches(senha, aluno.getSenhaHash())) {
                throw new SecurityException("Senha incorreta. " + aluno.getSenhaHash() + " / " + senha);
            }
            return new LoginResponse(
                aluno.getId(),
                aluno.getNome(),
                aluno.getEmail(),
                    "Aluno",
                aluno.getSaldo(),
                placeholderToken);
        }
        // Professor auth
        Empresa empresa = empresaRepository.findByEmailIgnoreCase(email)
                .orElse(null);
        if (empresa != null) {
            if (!encoder.matches(senha, empresa.getSenhaHash())) {
                throw new SecurityException("Senha incorreta. " + senha);
            }
                return new LoginResponse(
                    empresa.getId(),
                    empresa.getNome(),
                    empresa.getEmail(),
                    "Empresa",
                    null,
                    placeholderToken);
        }
        throw new SecurityException("Usuário não encontrado.");
    }
}
