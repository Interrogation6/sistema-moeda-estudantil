package moeda_estudantil.models;

import jakarta.persistence.*;

@Entity
public class Instituicao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    public String getNome() {
        return this.nome;
    }
}
