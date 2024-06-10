package net.estg.ei.backend.dao;

import net.estg.ei.backend.dto.FilterDTO;
import net.estg.ei.backend.entity.PredictionEntity;
import net.estg.ei.backend.enums.AttackType;
import org.antlr.v4.runtime.misc.Pair;

import java.util.List;
import java.util.Map;

public interface IPredictionDAO
{
  List<PredictionEntity> findAllWithFilters(FilterDTO filters);
  List<Object[]> countAttacksByDayLast30Days();

  Long getDailyAttackCounts();

  List<Object[]> countAttacksVsNonAttacks();

  Map<AttackType, Pair<Long, Double>> calculateAttackTypePercentages();
}
