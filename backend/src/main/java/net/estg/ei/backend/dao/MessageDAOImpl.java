package net.estg.ei.backend.dao;

import jakarta.persistence.EntityManager;
import net.estg.ei.backend.entity.MessageEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MessageDAOImpl extends AbstractDAOImpl<MessageEntity> implements IMessageDAO {

  @Autowired
  EntityManager entityManager;

  public MessageDAOImpl() {
    super(MessageEntity.class);
  }
}
