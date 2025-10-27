package moeda_estudantil.models;

import jakarta.persistence.*;

@Entity
public class Aluno {
    //SELECT id, nome, email, senha_hash, cpf, rg, cep, instituicao_id, curso_id, saldo, vantagem_id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String login;
    private String senha_hash;
    private Long cpf;
    private Long rg;
    private Long cep;
    //private Long instituicao_id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id")
    private Curso curso;
    private Double saldo;
    private Long vantagem_id;

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
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getLogin() {
        return login;
    }
    public void setLogin(String login) {
        this.login = login;
    }
    public String getSenhaHash() {
        return senha_hash;
    }
    public void setSenhaHash(String senha_hash) {
        this.senha_hash = senha_hash;
    }
    public Long getCpf() {
        return cpf;
    }
    public void setCpf(Long cpf) {
        this.cpf = cpf;
    }
    public Long getRg() {
        return rg;
    }
    public void setRg(Long rg) {
        this.rg = rg;
    }
    public Long getCep() {
        return cep;
    }
    public void setCep(Long cep) {
        this.cep = cep;
    }
    /* public Long getInstituicaoId() {
        return instituicao_id;
    }
    public void setInstituicaoId(Long instituicao_id) {
        this.instituicao_id = instituicao_id;
    } */
    public Curso getCurso() {
        return curso;
    }
    public void setCurso(Curso curso) {
        this.curso = curso;
    }
    public Double getSaldo() {
        return saldo;
    }
    public void setSaldo(Double saldo) {
        this.saldo = saldo;
    }
    public Long getVantagemId() {
        return vantagem_id;
    }
    public void setVantagemId(Long vantagem_id) {
        this.vantagem_id = vantagem_id;
    }
}
