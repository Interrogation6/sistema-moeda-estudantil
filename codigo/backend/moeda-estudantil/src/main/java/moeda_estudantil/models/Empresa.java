package moeda_estudantil.models;

import jakarta.persistence.*;

@Entity
public class Empresa {
    //SELECT id, nome, login, senha_hash, vantagem_id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String login;
    private String senha_hash;
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
    public Long getVantagemId() {
        return vantagem_id;
    }
    public void setVantagemId(Long vantagem_id) {
        this.vantagem_id = vantagem_id;
    }
    
}
