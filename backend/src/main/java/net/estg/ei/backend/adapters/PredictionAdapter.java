package net.estg.ei.backend.adapters;
import java.util.Date;

import net.estg.ei.backend.dto.PredictionDTO;
import net.estg.ei.backend.entity.PredictionEntity;

public class PredictionAdapter implements AbstractAdapter<PredictionEntity, PredictionDTO>
{
  public PredictionEntity dtoToEntity(PredictionDTO dto)
  {
    PredictionEntity entity = new PredictionEntity();
    entity.setId(dto.getId());
    entity.setCreatedDate(dto.getCreatedDate());
    entity.setSourceIp(dto.getSourceIp());
    entity.setDestinationIp(dto.getDestinationIp());
    entity.setProtocol(dto.getProtocol());
    entity.setAttack(dto.isAttack());
    entity.setAttackType(dto.getAttackType());

    return entity;
  }

  public PredictionDTO entityToDTO(PredictionEntity entity)
  {
    PredictionDTO dto = new PredictionDTO();
    dto.setId(entity.getId());
    dto.setCreatedDate(entity.getCreatedDate());
    dto.setSourceIp(entity.getSourceIp());
    dto.setDestinationIp(entity.getDestinationIp());
    dto.setProtocol(entity.getProtocol());
    dto.setAttack(entity.isAttack());
    dto.setAttackType(entity.getAttackType());

    return dto;
  }
}
