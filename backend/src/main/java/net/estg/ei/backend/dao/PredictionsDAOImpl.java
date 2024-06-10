package net.estg.ei.backend.dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.criteria.*;
import net.estg.ei.backend.dto.FilterDTO;
import net.estg.ei.backend.entity.PredictionEntity;
import net.estg.ei.backend.enums.AttackType;
import org.antlr.v4.runtime.misc.Pair;
import org.hibernate.Filter;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class PredictionsDAOImpl extends AbstractDAOImpl<PredictionEntity> implements IPredictionDAO {

  @Autowired
  EntityManager entityManager;

  public PredictionsDAOImpl() {
    super(PredictionEntity.class);
  }

  @Override
  public List<PredictionEntity> findAllWithFilters(FilterDTO filters)
  {
    Session session = entityManager.unwrap(Session.class);

    // Check each filter and apply it if not null
    if (filters.getSourceIpStartsWith() != null) {
      Filter filter = session.enableFilter("sourceIpFilter");
      filter.setParameter("sourceIpStartsWith", filters.getSourceIpStartsWith() + "%");
    }
    if (filters.getDestinationIpStartsWith() != null) {
      Filter filter = session.enableFilter("destinationIpFilter");
      filter.setParameter("destinationIpStartsWith", filters.getDestinationIpStartsWith() + "%");
    }
    if (filters.getProtocol() != null) {
      Filter filter = session.enableFilter("protocolFilter");
      filter.setParameter("protocolParam", filters.getProtocol());
    }
    if (filters.getIsAttack() != null) {
      Filter filter = session.enableFilter("attackFilter");
      filter.setParameter("isAttackParam", filters.getIsAttack());
    }
    if (filters.getAttackType() != null) {
      Filter filter = session.enableFilter("attackTypeFilter");
      filter.setParameter("attackTypeParam", filters.getAttackType());
    }
    if (filters.getDateMin() != null) {
      Filter dateMinFilter = session.enableFilter("dateMinFilter");
      dateMinFilter.setParameter("dateMin", filters.getDateMin());
    }

    if (filters.getDateMax() != null) {
      Filter dateMaxFilter = session.enableFilter("dateMaxFilter");
      dateMaxFilter.setParameter("dateMax", filters.getDateMax());
    }

    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    CriteriaQuery<PredictionEntity> cq = cb.createQuery(PredictionEntity.class);
    Root<PredictionEntity> rootEntry = cq.from(PredictionEntity.class);
    CriteriaQuery<PredictionEntity> all = cq.select(rootEntry);
    return entityManager.createQuery(all).getResultList();
  }

  @Override
  public List<Object[]> countAttacksByDayLast30Days() {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    CriteriaQuery<Object[]> cq = cb.createQuery(Object[].class);
    Root<PredictionEntity> root = cq.from(PredictionEntity.class);

    Expression<Date> dateExpression = cb.function("date", Date.class, root.get("createdDate"));
    Predicate isAttack = cb.isTrue(root.get("isAttack"));
    Predicate dateInRange = cb.greaterThanOrEqualTo(root.get("createdDate"),
            cb.literal(Date.from(LocalDate.now().minusDays(30).atStartOfDay(ZoneId.systemDefault()).toInstant())));

    cq.multiselect(dateExpression, cb.count(root))
            .where(cb.and(isAttack, dateInRange))
            .groupBy(dateExpression);

    return entityManager.createQuery(cq).getResultList();
  }

  @Override
  public Long getDailyAttackCounts() {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> cq = cb.createQuery(Long.class);
    Root<PredictionEntity> root = cq.from(PredictionEntity.class);

    Expression<Date> dateExpression = cb.function("date", Date.class, root.get("createdDate"));
    Predicate isAttack = cb.isTrue(root.get("isAttack"));
    Predicate dateInRange = cb.equal(dateExpression, Date.from(LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant()));

    cq.select(cb.count(root))
            .where(cb.and(isAttack, dateInRange))
            .groupBy(dateExpression);
    try {
      return entityManager.createQuery(cq).getSingleResult();
    }catch (NoResultException e) {
      return 0L;
    }
  }

  @Override
  public List<Object[]> countAttacksVsNonAttacks() {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    CriteriaQuery<Object[]> cq = cb.createQuery(Object[].class);
    Root<PredictionEntity> root = cq.from(PredictionEntity.class);

    Expression<Integer> caseForAttacks = cb.<Integer>selectCase()
            .when(cb.isTrue(root.get("isAttack")), 1)
            .otherwise(0);

    Expression<Integer> caseForNonAttacks = cb.<Integer>selectCase()
            .when(cb.isFalse(root.get("isAttack")), 1)
            .otherwise(0);

    Expression<Integer> totalAttacks = cb.sum(caseForAttacks);
    Expression<Integer> totalNonAttacks = cb.sum(caseForNonAttacks);

    cq.multiselect(totalAttacks, totalNonAttacks);
    return entityManager.createQuery(cq).getResultList();
  }

  @Override
  public Map<AttackType, Pair<Long, Double>> calculateAttackTypePercentages() {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    CriteriaQuery<Object[]> cq = cb.createQuery(Object[].class);
    Root<PredictionEntity> root = cq.from(PredictionEntity.class);

    CriteriaQuery<Long> totalQuery = cb.createQuery(Long.class);
    Root<PredictionEntity> totalRoot = totalQuery.from(PredictionEntity.class);
    totalQuery.select(cb.count(totalRoot))
            .where(cb.isTrue(totalRoot.get("isAttack")));

    Long totalAttacks = entityManager.createQuery(totalQuery).getSingleResult();

    cq.multiselect(root.get("attackType"), cb.count(root))
            .where(cb.isTrue(root.get("isAttack")))
            .groupBy(root.get("attackType"));

    List<Object[]> results = entityManager.createQuery(cq).getResultList();

    Map<AttackType, Pair<Long, Double>> countByType = new HashMap<>();
    for (Object[] result : results) {
      AttackType type = result[0] == null ? AttackType.UNKNOWN : (AttackType) result[0];
      Long count = (Long) result[1];
      Double percentage = (count / totalAttacks.doubleValue()) * 100;
      countByType.put(type,new Pair<>(count, percentage));
    }
    return countByType;
  }
}
