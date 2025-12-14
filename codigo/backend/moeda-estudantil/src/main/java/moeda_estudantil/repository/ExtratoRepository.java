package moeda_estudantil.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import moeda_estudantil.models.Extrato;

public interface ExtratoRepository extends JpaRepository<Extrato, Long> {
    List<Extrato> findByRemetenteIdOrDestinatarioIdOrderByDataHoraDesc(Long remetenteId, Long destinatarioId);
}
