package net.estg.ei.backend.websocket;
import lombok.Getter;
import lombok.Setter;
import net.estg.ei.backend.dao.IPredictionDAO;
import net.estg.ei.backend.entity.PredictionEntity;
import net.estg.ei.backend.service.IPredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SocketTextHandler extends TextWebSocketHandler {

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

  @Override
  protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    String payload = message.getPayload();
    try {
      PredictionData data = mapper.readValue(payload, PredictionData.class);
      System.out.println("Received prediction: " + data.getPrediction());

      PredictionEntity entity = new PredictionEntity();
      entity.setPrediction(data.getPrediction().toString());
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
  static class PredictionData {
    private List<Double> prediction;
  }
}
