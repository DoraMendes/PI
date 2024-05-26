package net.estg.ei.backend.dao;

import net.estg.ei.backend.entity.PredictionEntity;
import org.springframework.stereotype.Component;

@Component
public class PredictionsDAOImpl extends AbstractDAOImpl<PredictionEntity> implements IPredictionDAO {

  public PredictionsDAOImpl() {
    super(PredictionEntity.class);
  }
}
