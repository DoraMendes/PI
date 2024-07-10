package net.estg.ei.backend.service;

import net.estg.ei.backend.dao.IPredictionDAO;
import net.estg.ei.backend.dto.FilterDTO;
import net.estg.ei.backend.dto.GeoLocationDTO;
import net.estg.ei.backend.entity.PredictionEntity;
import net.estg.ei.backend.enums.AttackType;
import org.antlr.v4.runtime.misc.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class PredictionsServiceImpl extends AbstractServiceImpl<PredictionEntity> implements IPredictionService
{
  @Autowired
  IPredictionDAO predictionDAO;
  @Autowired
  GeoIPService geoIPService;

  @Override
  @Transactional(readOnly = true)
  public List<PredictionEntity> getFilteredPredictions(@ModelAttribute FilterDTO filters) {
    return predictionDAO.findAllWithFilters(filters);
  }

  @Override
  @Transactional(readOnly = true)
  public List<Object[]> getAttacksByDayLast30Days() {
    return predictionDAO.countAttacksByDayLast30Days();
  }
  @Override
  @Transactional(readOnly = true)
  public Long getDailyAttackCounts() {
    return predictionDAO.getDailyAttackCounts();
  }
  @Override
  @Transactional(readOnly = true)
  public List<Object[]> countAttacksVsNonAttacks() {
    return predictionDAO.countAttacksVsNonAttacks();
  }
  @Override
  @Transactional(readOnly = true)
  public Map<AttackType, Pair<Long, Double>> calculateAttackTypePercentages() {
    return predictionDAO.calculateAttackTypePercentages();
  }
  @Override
  @Transactional(readOnly = true)
  public GeoLocationDTO getGeolocationIp(Long id) throws IOException
  {
    PredictionEntity prediction = findById(id);
    return geoIPService.getGeoLocation(prediction.getSourceIp());
  }
}
