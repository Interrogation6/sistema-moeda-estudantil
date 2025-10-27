package moeda_estudantil.views;

public record AlunoDTO(
    String nome,
    String email,
    Long cursoId,
    Double saldo
) {}