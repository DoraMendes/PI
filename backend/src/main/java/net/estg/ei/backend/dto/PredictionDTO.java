package net.estg.ei.backend.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.estg.ei.backend.enums.AttackType;

import java.io.Serializable;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PredictionDTO implements Serializable
{
  private Date createdDate;
  private String sourceIp;
  private String destinationIp;
  private String protocol;
  private boolean isAttack;
  private AttackType attackType;
}
