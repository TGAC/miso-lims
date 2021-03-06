package uk.ac.bbsrc.tgac.miso.persistence.impl;

import java.io.IOException;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import uk.ac.bbsrc.tgac.miso.core.data.Pool;
import uk.ac.bbsrc.tgac.miso.core.data.SequencingOrder;
import uk.ac.bbsrc.tgac.miso.core.data.SequencingParameters;
import uk.ac.bbsrc.tgac.miso.core.data.impl.RunPurpose;
import uk.ac.bbsrc.tgac.miso.core.data.impl.SequencingOrderImpl;
import uk.ac.bbsrc.tgac.miso.persistence.SequencingOrderDao;

@Repository
@Transactional(rollbackFor = Exception.class)
public class HibernateSequencingOrderDao extends HibernateSaveDao<SequencingOrder> implements SequencingOrderDao {

  public HibernateSequencingOrderDao() {
    super(SequencingOrderImpl.class);
  }

  @Override
  public List<SequencingOrder> listByPool(Pool pool) {
    @SuppressWarnings("unchecked")
    List<SequencingOrder> records = currentSession().createCriteria(SequencingOrderImpl.class)
        .add(Restrictions.eq("pool", pool))
        .list();
    return records;
  }

  @Override
  public List<SequencingOrder> listByAttributes(Pool pool, RunPurpose purpose, SequencingParameters parameters, Integer partitions)
      throws IOException {
    @SuppressWarnings("unchecked")
    List<SequencingOrder> records = currentSession().createCriteria(SequencingOrderImpl.class)
        .add(Restrictions.eq("pool", pool))
        .add(Restrictions.eq("purpose", purpose))
        .add(Restrictions.eq("parameters", parameters))
        .add(Restrictions.eq("partitions", partitions))
        .list();
    return records;
  }

}
