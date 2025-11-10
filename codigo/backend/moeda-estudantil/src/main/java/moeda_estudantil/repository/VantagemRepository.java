package moeda_estudantil.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import moeda_estudantil.models.Vantagem;
import moeda_estudantil.views.VantagemView;

public interface VantagemRepository extends JpaRepository<Vantagem, Long> {

        @Query("""
                        select new moeda_estudantil.views.VantagemView(
                        v.id,
                        v.nome,
                        e.nome,
                        v.descricao,
                        v.valor,
                        v.ativo
                        )
                        from Vantagem v
                        join v.empresa e
                        where v.ativo = true
                        order by v.nome""")
        List<VantagemView> findAtivos();

        @Query("""
                        select new moeda_estudantil.views.VantagemView(
                        v.id,
                        v.nome,
                        e.nome,
                        v.descricao,
                        v.valor,
                        v.ativo
                        )
                        from Vantagem v
                        join v.empresa e
                        where e.id = :empresaId
                        order by v.nome
                        """)
        List<VantagemView> findByEmpresa(Long empresaId);

}
