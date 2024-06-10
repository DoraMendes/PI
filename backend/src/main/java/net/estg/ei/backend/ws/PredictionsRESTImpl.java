package net.estg.ei.backend.ws;

import net.estg.ei.backend.adapters.AbstractAdapter;
import net.estg.ei.backend.adapters.PredictionAdapter;
import net.estg.ei.backend.dto.FilterDTO;
import net.estg.ei.backend.dto.PredictionDTO;
import net.estg.ei.backend.entity.PredictionEntity;
import net.estg.ei.backend.enums.AttackType;
import net.estg.ei.backend.service.IPredictionService;
import org.antlr.v4.runtime.misc.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/predictions")
public class PredictionsRESTImpl extends AbstractRESTImpl<PredictionEntity, PredictionDTO>{

  @Autowired
  private IPredictionService predictionService;

  public PredictionsRESTImpl(IPredictionService service)
  {
    super(service);
  }

  @Override
  protected AbstractAdapter<PredictionEntity, PredictionDTO> getAdapter()
  {
    return new PredictionAdapter();
  }

  @GetMapping("/filtered")
  public List<PredictionDTO> getPredictions(@ModelAttribute FilterDTO filters) {
    List<PredictionEntity> entities = predictionService.getFilteredPredictions(filters);
    return entities.stream().map(this.getAdapter()::entityToDTO).toList();
  }
  /*
  * Filter QUERY PARAMS
  *   String sourceIpStartsWith;
  *   String destinationIpStartsWith;
  *   String protocol;
  *   Boolean isAttack;
  *   String attackType;
  *   Date dateMin;
  *   Date dateMax;
  *
   */

  @GetMapping("/attackslastmonth")
  public List<Object[]> getAttacksByDayLast30Days() {
    return predictionService.getAttacksByDayLast30Days();
  }
  /*
   *  [
   *    [
   *        "2024-06-09", (DATE)
   *        3 (COUNT)
   *    ],
   *    [
   *        "2024-06-10",
   *        3
   *    ]
   *]
   */

  @GetMapping("/countAttacksVsNonAttacks")
  public List<Object[]> countAttacksVsNonAttacks() {
    return predictionService.countAttacksVsNonAttacks();
  }
  /*
   *  [
   *    [
   *        8, (ATTACKS)
   *        14 (NOT ATTACKS)
   *    ]
   *]
   */

  @GetMapping("/calculateAttackTypePercentages")
  public Map<AttackType, Pair<Long, Double>> calculateAttackTypePercentages(){
    return predictionService.calculateAttackTypePercentages();
  }
  /*
  * {
  *   "TYPE": {
  *   "a": COUNT,
  *           "b": PERCENTAGE
  * }
  *
  * {
  *   "UNKNOWN": {
  *   "a": 1,
  *           "b": 12.5
  * },
  *   "DDOS": {
  *   "a": 4,
  *           "b": 50.0
  * },
  *   "MALARIA": {
  *   "a": 3,
  *           "b": 37.5
  * }
  * }
  */
}
