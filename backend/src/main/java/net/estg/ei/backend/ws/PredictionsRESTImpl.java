package net.estg.ei.backend.ws;

import net.estg.ei.backend.adapters.AbstractAdapter;
import net.estg.ei.backend.adapters.PredictionAdapter;
import net.estg.ei.backend.dto.PredictionDTO;
import net.estg.ei.backend.entity.PredictionEntity;
import net.estg.ei.backend.service.IPredictionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/predictions")
public class PredictionsRESTImpl extends AbstractRESTImpl<PredictionEntity, PredictionDTO>{
  public PredictionsRESTImpl(IPredictionService service)
  {
    super(service);
  }

  @Override
  protected AbstractAdapter<PredictionEntity, PredictionDTO> getAdapter()
  {
    return new PredictionAdapter();
  }
}
