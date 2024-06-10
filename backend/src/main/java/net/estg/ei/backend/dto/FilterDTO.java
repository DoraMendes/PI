package net.estg.ei.backend.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Getter
@Setter
public class FilterDTO
{
  private String sourceIpStartsWith;
  private String destinationIpStartsWith;
  private String protocol;
  private Boolean isAttack;
  private String attackType;
  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private Date dateMin;
  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private Date dateMax;
}
