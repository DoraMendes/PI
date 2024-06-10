package net.estg.ei.backend.service;

import net.estg.ei.backend.dao.IPredictionDAO;
import net.estg.ei.backend.dto.FilterDTO;
import net.estg.ei.backend.entity.PredictionEntity;
import net.estg.ei.backend.enums.AttackType;
import org.antlr.v4.runtime.misc.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.util.List;
import java.util.Map;

@Service
public class PredictionsServiceImpl extends AbstractServiceImpl<PredictionEntity> implements IPredictionService
{
  @Autowired
  IPredictionDAO predictionDAO;

  @Override
  public List<PredictionEntity> getFilteredPredictions(@ModelAttribute FilterDTO filters) {
    return predictionDAO.findAllWithFilters(filters);
  }

  @Override
  public List<Object[]> getAttacksByDayLast30Days() {
    return predictionDAO.countAttacksByDayLast30Days();
  }
  @Override
  public List<Object[]> countAttacksVsNonAttacks() {
    return predictionDAO.countAttacksVsNonAttacks();
  }
  @Override
  public Map<AttackType, Pair<Long, Double>> calculateAttackTypePercentages() {
    return predictionDAO.calculateAttackTypePercentages();
  }
}
