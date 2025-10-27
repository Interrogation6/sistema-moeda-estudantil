package moeda_estudantil.models;

import java.lang.classfile.Instruction;

import jakarta.persistence.*;

@Entity
public class Curso {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instituicao_id")
    private Instituicao instituicao;

    public String getNome(){
        return this.nome;
    }

    public Instituicao getInstituicao() {
        return this.instituicao;
    }
}
