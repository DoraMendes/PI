package net.estg.ei.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "predictions")
public class PredictionEntity extends AbstractEntity{

  @Column(name = "prediction")
  private String prediction;
}
