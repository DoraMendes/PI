package net.estg.ei.backend.websocket;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.estg.ei.backend.entity.PredictionEntity;
import net.estg.ei.backend.enums.AttackType;
import net.estg.ei.backend.service.IPredictionService;
import net.estg.ei.backend.utils.ProtocolUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

  private ObjectMapper mapper = new ObjectMapper();
  private static final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

  @Autowired
  private IPredictionService predictionService;

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
  protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    String payload = message.getPayload();
    try {
      PredictionData data = mapper.readValue(payload, PredictionData.class);
      System.out.println("Received prediction: " + data.getPrediction());

      PredictionEntity entity = new PredictionEntity();

      //TODO FIX isAttack and attackType
      boolean isAttack = data.getPrediction().get(0) == 1.0;
      AttackType attackType = isAttack ? AttackType.DDOS : null;

      // Set entity values using the parsed data
      entity.setSourceIp(data.getSource_ip());
      entity.setDestinationIp(data.getDestination_ip());

      String protocolName =
              Objects.equals(ProtocolUtils.getProtocolName(Integer.parseInt(data.getProtocol())), "Unknown")
                      ? data.getProtocol() : ProtocolUtils.getProtocolName(Integer.parseInt(data.getProtocol()));
      entity.setProtocol(protocolName);

      entity.setAttack(isAttack);
      entity.setAttackType(attackType);

      predictionService.save(entity);

      session.sendMessage(new TextMessage("Prediction saved: " + data.getPrediction()));

    } catch (Exception e) {
      System.out.println("Error processing message: " + e.getMessage());
    }
    // Broadcast the payload back to all connected clients
    for (WebSocketSession webSocketSession : sessions) {
      if (webSocketSession.isOpen()) {
        webSocketSession.sendMessage(new TextMessage("Received: " + payload));
      }
    }
  }

  @Override
  public void afterConnectionClosed(WebSocketSession session, CloseStatus status)
  {
    sessions.remove(session);
    System.out.println("Removed session from sessions list.");
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
