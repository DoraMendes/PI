package net.estg.ei.backend.ws;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import net.estg.ei.backend.adapters.AbstractAdapter;
import net.estg.ei.backend.adapters.MessageAdapter;
import net.estg.ei.backend.dto.MessageDTO;
import net.estg.ei.backend.entity.MessageEntity;
import net.estg.ei.backend.service.IMessageService;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "https://pi-zeta-two.vercel.app"})
@RequestMapping(value = "/api/messages", produces = "application/json")
public class MessageRESTImpl extends AbstractRESTImpl<MessageEntity, MessageDTO>{

  @Autowired
  private IMessageService messageService;

  public MessageRESTImpl(IMessageService service) {
    super(service);
  }

  @PostMapping("/subscribe")
  public void subscribe(@RequestBody MessageDTO messageDTO) {
    messageService.save(this.getAdapter().dtoToEntity(messageDTO));
  }

  @Override
  protected AbstractAdapter<MessageEntity, MessageDTO> getAdapter() {
    return new MessageAdapter();
  }
}
