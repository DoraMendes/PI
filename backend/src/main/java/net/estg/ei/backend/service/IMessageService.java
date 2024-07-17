package net.estg.ei.backend.service;

import net.estg.ei.backend.entity.MessageEntity;
import nl.martijndwars.webpush.Subscription;

public interface IMessageService extends IAbstractService<MessageEntity> {
    void sendToAllNotification(String messageJson);
}
