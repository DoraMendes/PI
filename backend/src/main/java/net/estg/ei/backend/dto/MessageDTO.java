package net.estg.ei.backend.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private String endpoint;
    private Date expirationTime;
    private String keyAuth;
    private String keyPrivate;
}
