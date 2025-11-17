package moeda_estudantil.models;

import jakarta.persistence.*;

@Entity
public class Vantagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;

    private String nome;
    private String descricao;
    private boolean ativo;
    private double valor;
    private String imagem_path;

    public String getImagemPath() {
        return imagem_path;
    }

    public void setImagemPath(String imagem_path) {
        this.imagem_path = imagem_path;
    }

    public boolean setEmpresa(Empresa empresa) {
        if (empresa == null)
            return false;
        this.empresa = empresa;
        return true;
    }

    public Empresa getEmpresa() {
        return this.empresa;
    }

    public boolean getAtivo() {
        return this.ativo;
    }

    public void setAtivo(boolean status) {
        this.ativo = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

}
