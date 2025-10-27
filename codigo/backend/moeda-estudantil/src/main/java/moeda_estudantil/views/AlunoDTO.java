package moeda_estudantil.views;

public record AlunoDTO(
    String nome,
    String senha_hash,
    String email,
    Long cursoId,
    Double saldo
) {}