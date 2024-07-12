package net.estg.ei.backend.service;

import net.estg.ei.backend.dto.FilterDTO;
import net.estg.ei.backend.dto.GeoLocationDTO;
import net.estg.ei.backend.entity.PredictionEntity;
import net.estg.ei.backend.enums.AttackType;
import org.antlr.v4.runtime.misc.Pair;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IPredictionService extends IAbstractService<PredictionEntity>
{
  List<PredictionEntity> getFilteredPredictions(@ModelAttribute FilterDTO filters);
  List<Object[]> getAttacksByDayLast30Days();
  Long getDailyAttackCounts();
  List<Object[]> countAttacksVsNonAttacks();
  Map<AttackType, Pair<Long, Double>> calculateAttackTypePercentages();
  GeoLocationDTO getGeolocationIp(Long id) throws IOException;
}
