package net.estg.ei.backend.adapters;

import net.estg.ei.backend.dto.PredictionDTO;
import net.estg.ei.backend.entity.PredictionEntity;

public class PredictionAdapter implements AbstractAdapter<PredictionEntity, PredictionDTO>
{
  public PredictionEntity dtoToEntity(PredictionDTO dto)
  {
    PredictionEntity entity = new PredictionEntity();
    entity.setPrediction(dto.getPrediction());
    return entity;
  }

  public PredictionDTO entityToDTO(PredictionEntity entity)
  {
    PredictionDTO dto = new PredictionDTO();
    dto.setPrediction(entity.getPrediction());
    return dto;
  }
}
