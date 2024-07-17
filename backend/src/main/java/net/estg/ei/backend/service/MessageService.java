package net.estg.ei.backend.service;

import java.security.GeneralSecurityException;
import java.security.Security;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import net.estg.ei.backend.dao.IMessageDAO;
import net.estg.ei.backend.entity.MessageEntity;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import nl.martijndwars.webpush.Subscription.Keys;

@Service
public class MessageService extends AbstractServiceImpl<MessageEntity> implements IMessageService {

  @Value("${vapid.public.key}")
  private String publicKey;
  @Value("${vapid.private.key}")
  private String privateKey;

  private PushService pushService;

  @Autowired
  IMessageDAO messageDAO;

  @PostConstruct
  private void init() throws GeneralSecurityException {
    Security.addProvider(new BouncyCastleProvider());
    pushService = new PushService(publicKey, privateKey);
  }

  public void sendToAllNotification(String body) {
    try {
      for (MessageEntity message : this.messageDAO.findAll()) {
        Subscription sub = new Subscription(message.getEndpoint(), new Keys(message.getKeyPrivate(), message.getKeyAuth()));
        pushService.send(new Notification(sub, body));
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}