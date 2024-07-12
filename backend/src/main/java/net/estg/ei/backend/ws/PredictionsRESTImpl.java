package net.estg.ei.backend.ws;

import net.estg.ei.backend.adapters.AbstractAdapter;
import net.estg.ei.backend.adapters.PredictionAdapter;
import net.estg.ei.backend.dto.FilterDTO;
import net.estg.ei.backend.dto.GeoLocationDTO;
import net.estg.ei.backend.dto.PredictionDTO;
import net.estg.ei.backend.entity.PredictionEntity;
import net.estg.ei.backend.enums.AttackType;
import net.estg.ei.backend.service.IPredictionService;
import org.antlr.v4.runtime.misc.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://pi-zeta-two.vercel.app"})
@RequestMapping(value = "/api/predictions", produces = "application/json")
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
  @GetMapping("/filtered")
  public List<PredictionDTO> getPredictions(@ModelAttribute FilterDTO filters) {
    List<PredictionEntity> entities = predictionService.getFilteredPredictions(filters);
    return entities.stream().map(this.getAdapter()::entityToDTO).toList();
  }

  /*
   *Attacks today
   */
  @GetMapping("/dailyattackcounts")
  public Long getDailyAttackCounts() {
    return predictionService.getDailyAttackCounts();
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
  @GetMapping("/attackslastmonth")
  public List<Object[]> getAttacksByDayLast30Days() {
    return predictionService.getAttacksByDayLast30Days();
  }


  /*
   *  [
   *    [
   *        8, (ATTACKS)
   *        14 (NOT ATTACKS)
   *    ]
   *]
   */
  @GetMapping("/attackvsnonattack")
  public List<Object[]> countAttacksVsNonAttacks() {
    return predictionService.countAttacksVsNonAttacks();
  }
  /*
   *{
   *   "country": "Country (Unknown if null)",
   *   "city": "City (Unknown if null)",
   *   "latitude": xx.yyyy,
   *   "longitude": xx.yyyy
   * }
   */
  @GetMapping("/geoip/{id}")
  public GeoLocationDTO getGeoIpLocation(@PathVariable long id){
    try {
      return predictionService.getGeolocationIp(id);
    }catch (IOException ignored){}
    return null;
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
  @GetMapping("/attacktypepercentages")
  public Map<AttackType, Pair<Long, Double>> calculateAttackTypePercentages(){
    return predictionService.calculateAttackTypePercentages();
  }
}
