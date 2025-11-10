package moeda_estudantil.models;

import java.util.List;
import jakarta.persistence.*;

@Entity
public class Empresa {
    //SELECT id, nome, login, senha_hash, vantagem_id
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String email;
    private String senha_hash;
    @OneToMany(mappedBy = "empresa", cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    private List<Vantagem> vantagens;

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

    public void setEmail(String login) {
        this.email = login;
    }
    public String getSenhaHash() {
        return senha_hash;
    }
    public void setSenhaHash(String senha_hash) {
        this.senha_hash = senha_hash;
    }

    public void addVantagem(Vantagem v) {
        if (v == null)
            return;
        if (!vantagens.contains(v)) {
            vantagens.add(v);
        }

        v.setEmpresa(this);
        v.setAtivo(true);
    }

    public void unlinkVantagem(Vantagem v) {
        if (v == null)
            return;
        if (v.getEmpresa() == this && vantagens.remove(v)) {
            v.setEmpresa(null);
        }
    }
}
