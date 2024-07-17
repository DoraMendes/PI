package net.estg.ei.backend.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageEntity extends AbstractEntity {

    @Column(name = "endpoint")
    private String endpoint;

    @Column(name = "expirationTime")
    private Date expirationTime;

    @Column(name = "keyAuth")
    private String keyAuth;

    @Column(name = "keyPrivate")
    private String keyPrivate;
}