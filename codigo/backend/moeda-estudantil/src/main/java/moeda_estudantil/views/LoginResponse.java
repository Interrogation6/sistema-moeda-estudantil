package moeda_estudantil.views;

public record LoginResponse(
        Long id,
        String nome,
        String email,
        String tipo,
        String token) {
}
