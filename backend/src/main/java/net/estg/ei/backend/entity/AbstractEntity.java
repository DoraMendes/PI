package net.estg.ei.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@MappedSuperclass
@Getter
@Setter
public abstract class AbstractEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Integer id;

  @Column(name = "created_date", nullable = false, updatable = false)
  @Temporal(TemporalType.TIMESTAMP)
  private Date createdDate;

  @PrePersist
  protected void onCreate() {
    createdDate = new Date();
  }
}
