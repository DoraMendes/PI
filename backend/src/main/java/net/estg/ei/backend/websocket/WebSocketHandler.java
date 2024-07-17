package net.estg.ei.backend.websocket;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import net.estg.ei.backend.adapters.PredictionAdapter;
import net.estg.ei.backend.entity.PredictionEntity;
import net.estg.ei.backend.enums.AttackType;
import net.estg.ei.backend.service.IMessageService;
import net.estg.ei.backend.service.IPredictionService;
import net.estg.ei.backend.utils.AttackTypeUtils;
import net.estg.ei.backend.utils.ProtocolUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.support.PeriodicTrigger;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import io.netty.util.concurrent.ScheduledFuture;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;

@Component
@EnableScheduling
public class WebSocketHandler extends TextWebSocketHandler {

  private final ObjectMapper mapper = new ObjectMapper();
  private static final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
  private ScheduledFuture<?> scheduledFuture = null;

  @Value("${application.attack.threshold:5}") // Attack Threshold for broadcasting, if not defined in property file default = 5
  private static final int attackThreshold = 5;
  private int consecutiveAttackCount = 0;

  @Autowired
  private IPredictionService predictionService;

  @Autowired
  private IMessageService messageService;

  @Autowired
  private TaskScheduler taskScheduler;


  @Override
  public void afterConnectionEstablished(WebSocketSession session)
  {
    sessions.add(session);
    System.out.println("Added session to sessions list.");
  }

//  Example data received from the python script
//  {
//    "prediction": [1.0, 0.0], // Example of a binary attack prediction
//    "protocol": "TCP",
//    "src_ip": x.x.x.x,
//    "dst_ipd": x.x.x.x
//  }

  @Override
  protected void handleTextMessage(WebSocketSession session, TextMessage message) {
    String payload = message.getPayload();
    try {
      PredictionData data = mapper.readValue(payload, PredictionData.class);
      PredictionEntity entity = new PredictionEntity();

      boolean isAttack = data.getPrediction().get(0) < .2;
      AttackType attackType = isAttack ? AttackTypeUtils.getAttackType(data.getPrediction()) : null;

      // Set entity values using the parsed data
      entity.setSourceIp(data.getSource_ip());
      entity.setDestinationIp(data.getDestination_ip());

      System.out.println(AttackTypeUtils.getAttackType(data.getPrediction()));
      String protocolName =
              Objects.equals(ProtocolUtils.getProtocolName(Integer.parseInt(data.getProtocol())), "Unknown")
                      ? data.getProtocol() : ProtocolUtils.getProtocolName(Integer.parseInt(data.getProtocol()));
      entity.setProtocol(protocolName);

      entity.setAttack(isAttack);
      entity.setAttackType(attackType);

      predictionService.save(entity);

      session.sendMessage(new TextMessage("Prediction saved: " + data.getPrediction()));


      if (isAttack) { //Only broadcast attacks after a certain number have been detected in succession
        if (this.scheduledFuture == null) {
            final int xSeconds = 5;
            @SuppressWarnings("deprecation")
            PeriodicTrigger periodicTrigger = new PeriodicTrigger(xSeconds, TimeUnit.SECONDS);
            this.scheduledFuture = (ScheduledFuture<?>) taskScheduler.schedule(() -> this.messageService.sendToAllNotification("Your Infrastructure is under Attack"), periodicTrigger);
        }
        consecutiveAttackCount++;
        if (consecutiveAttackCount >= attackThreshold) {
          // Broadcast the payload back to all connected clients
          broadcastPrediction(entity, session);
          consecutiveAttackCount = 0; // Reset the counter after broadcasting
        }
      } else {
        this.scheduledFuture.cancel(false);
        this.scheduledFuture = null;

        consecutiveAttackCount = 0; // Reset the counter if an attack is not detected
        broadcastPrediction(entity, session); //Broadcast non-malicious attack anyway
      }

    } catch (Exception e) {
      System.out.println("Error processing message: " + e.getMessage());
    }
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
  {
    sessions.remove(session);
    System.out.println("Removed session from sessions list.");
  }

  private void broadcastPrediction(PredictionEntity entity, WebSocketSession currentSession) throws Exception {
    for (WebSocketSession webSocketSession : sessions) {
      if (webSocketSession.isOpen() && !webSocketSession.equals(currentSession)) {
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        PredictionAdapter predictionAdapter = new PredictionAdapter();
        String json = ow.writeValueAsString(predictionAdapter.entityToDTO(entity));
        webSocketSession.sendMessage(new TextMessage(json));
      }
    }
  }
  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @JsonInclude(JsonInclude.Include.NON_NULL)
  public static class PredictionData {
    private List<Double> prediction;
    private String source_ip;
    private String destination_ip;
    private String protocol;
  }
}
