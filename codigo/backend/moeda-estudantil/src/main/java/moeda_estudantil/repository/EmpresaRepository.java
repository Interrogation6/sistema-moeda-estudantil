package moeda_estudantil.repository;

import moeda_estudantil.models.Aluno;
import moeda_estudantil.models.Empresa;
import moeda_estudantil.views.EmpresaView;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EmpresaRepository extends JpaRepository<Empresa, Long> {
    @Query("""
         select new moeda_estudantil.views.EmpresaView(
           e.id,
           e.nome,
           e.email
         )
         from Empresa e
         order by e.nome
         """)
  List<EmpresaView> findAllView();

  Optional<Empresa> findByEmailIgnoreCase(String email);
}
