package moeda_estudantil.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;

import moeda_estudantil.models.Aluno;
import moeda_estudantil.repository.AlunoRepository;
import moeda_estudantil.views.LoginDTO;
import moeda_estudantil.views.LoginResponse;

@Validated
@Service
public class AuthService {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private PasswordEncoder encoder;

    public LoginResponse login(@Validated LoginDTO dto) {
        System.out.println("Tentando login com e-mail: " + dto.login());
        Aluno aluno = alunoRepository.findByEmailIgnoreCase(dto.login())
                .orElseThrow(() -> new SecurityException("Usuário não encontrado."));

        if (!encoder.matches(dto.senha(), aluno.getSenhaHash())) {
            throw new SecurityException("Senha incorreta.");
        }

        return new LoginResponse(
                aluno.getId(),
                aluno.getNome(),
                aluno.getEmail(),
                "ALUNO", // TODO: adcionar professor e admin
                "token-falso-temporario");
    }
}
