package net.estg.ei.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.estg.ei.backend.enums.AttackType;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FilterDef(name="protocolFilter", parameters=@ParamDef(name="protocolParam", type=String.class))
@FilterDef(name="attackFilter", parameters=@ParamDef(name="isAttackParam", type=Boolean.class))
@FilterDef(name="attackTypeFilter", parameters=@ParamDef(name="attackTypeParam", type=String.class))
@FilterDef(name="sourceIpFilter", parameters=@ParamDef(name="sourceIpStartsWith", type=String.class))
@FilterDef(name="destinationIpFilter", parameters=@ParamDef(name="destinationIpStartsWith", type=String.class))
@FilterDef(name="dateMinFilter", parameters=@ParamDef(name="dateMin", type=Date.class))
@FilterDef(name="dateMaxFilter", parameters=@ParamDef(name="dateMax", type=Date.class))
@Filter(name="dateMinFilter", condition="created_date >= :dateMin")
@Filter(name="dateMaxFilter", condition="created_date <= :dateMax")
@Filter(name="protocolFilter", condition="protocol = :protocolParam")
@Filter(name="attackFilter", condition="is_attack = :isAttackParam")
@Filter(name="dateFilter", condition="created_date between :dateMin and :dateMax")
@Filter(name="attackTypeFilter", condition="attack_type = :attackTypeParam")
@Filter(name="sourceIpFilter", condition="source_ip LIKE :sourceIpStartsWith")
@Filter(name="destinationIpFilter", condition="destination_ip LIKE :destinationIpStartsWith")
@Table(name = "predictions")
public class PredictionEntity extends AbstractEntity {

  @Column(name = "source_ip")
  private String sourceIp;

  @Column(name = "destination_ip")
  private String destinationIp;

  @Column(name = "protocol")
  private String protocol;

  @Column(name = "is_attack", nullable = false)
  private boolean isAttack;

  @Column(name = "attack_type")
  @Enumerated(EnumType.STRING)
  private AttackType attackType;
}
