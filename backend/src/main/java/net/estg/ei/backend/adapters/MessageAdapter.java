package net.estg.ei.backend.adapters;

import net.estg.ei.backend.dto.MessageDTO;
import net.estg.ei.backend.entity.MessageEntity;

public class MessageAdapter implements AbstractAdapter<MessageEntity, MessageDTO> {

    @Override
    public MessageDTO entityToDTO(MessageEntity entity) {
        MessageDTO dto = new MessageDTO();
        dto.setEndpoint(entity.getEndpoint());
        dto.setExpirationTime(entity.getExpirationTime());
        dto.setKeyAuth(entity.getKeyAuth());
        dto.setKeyPrivate(entity.getKeyPrivate());
        return dto;
    }

    @Override
    public MessageEntity dtoToEntity(MessageDTO dto) {
        MessageEntity entity = new MessageEntity();
        entity.setEndpoint(dto.getEndpoint());
        entity.setExpirationTime(dto.getExpirationTime());
        entity.setKeyAuth(dto.getKeyAuth());
        entity.setKeyPrivate(dto.getKeyPrivate());
        return entity;
    }
}
