package be.vinci.pae.services.visitrequest;

import be.vinci.pae.domain.visitrequest.VisitRequestDTO;
import be.vinci.pae.services.DalBackendServices;
import be.vinci.pae.utils.FatalException;
import jakarta.inject.Inject;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;


public class DAOVisitRequestImpl implements DAOVisitRequest {

  private String queryAddVisitRequest;

  @Inject
  private DalBackendServices dalServices;

  /*
  @Inject
  private VisitRequestFactory visitRequestFactory;

  @Inject
  private DAOAddress daoAddress;

  @Inject
  private DAOUser daoUser;
  */

  /*
   * querySelectVisitRequestById = "SELECT v.visit_request_id, v.request_date, v.time_slot, "
   * + "v.address, v.status, v.chosen_date_time, v.cancellation_reason, v.customer "
   * + "FROM project.visit_requests v WHERE v.visit_request_id  = ?";
   */

  /**
   * constructor of DAOVisitRequestImpl. contains queries.
   */
  public DAOVisitRequestImpl() {
    queryAddVisitRequest =
        "INSERT INTO project.visit_requests (visit_request_id, request_date, time_slot, address,"
            + " status, chosen_date_time, cancellation_reason, customer) VALUES"
            + " (DEFAULT,?,?,?,?,NULL,NULL,?)";
  }

  @Override
  public int addVisitRequest(VisitRequestDTO visitRequest) {
    int visitRequestId = -1;
    try {
      PreparedStatement insertVisitRequest =
          this.dalServices.getPreparedStatementAdd(queryAddVisitRequest);
      insertVisitRequest.setTimestamp(1, Timestamp.from(visitRequest.getRequestDate().toInstant()));
      insertVisitRequest.setString(2, visitRequest.getTimeSlot());
      if (visitRequest.getAddress() == null) {
        insertVisitRequest.setNull(3, java.sql.Types.INTEGER);
      } else {
        insertVisitRequest.setInt(3, visitRequest.getAddress().getId());
      }
      insertVisitRequest.setInt(4, visitRequest.getStatus().ordinal());
      insertVisitRequest.setInt(5, visitRequest.getCustomer().getId());
      insertVisitRequest.execute();
      try (ResultSet rs = insertVisitRequest.getGeneratedKeys()) {
        if (rs.next()) {
          visitRequestId = rs.getInt(1);
        }
        return visitRequestId;
      }
    } catch (SQLException e) {
      throw new FatalException("Data error : insertVisitRequest");
    }
  }

  @Override
  public VisitRequestDTO selectVisitRequestById(int id) {
    // TODO Auto-generated method stub
    return null;

    /*
     * VisitRequestDTO visitRequest = null; try { PreparedStatement selectVisitRequestById =
     * dalServices.getPreparedStatement(querySelectVisitRequestById);
     * selectVisitRequestById.setInt(1, id); try (ResultSet rs =
     * selectVisitRequestById.executeQuery()) { visitRequest =
     * this.visitRequestFactory.getVisitRequest(); while (rs.next()) {
     * visitRequest.setId(rs.getInt("visit_request_id"));
     * visitRequest.setRequestDate(rs.getDate("request_date"));
     * visitRequest.setTimeSlot(rs.getString("time_slot"));
     * visitRequest.setStatus(String.valueOf(rs.getInt("status")));
     * visitRequest.setChosenDateTime(rs.getDate("chosen_date_time"));
     * visitRequest.setCancellationReason(rs.getString("cancellation_reason"));
     * visitRequest.setCustomer(this.daoUser.getUserById(rs.getInt("customer"))); } return
     * visitRequest; } } catch (SQLException e) { e.printStackTrace(); throw new
     * FatalException("Data error : selectTypeById"); }
     */
  }
  /*
  private VisitRequestDTO createVisitRequest(ResultSet rs) throws SQLException {
    VisitRequestDTO visitRequest = null;
    if (rs.next()) {
      visitRequest = this.visitRequestFactory.getVisitRequest();
      visitRequest.setId(rs.getInt("visit_request_id"));
      visitRequest.setRequestDate(rs.getDate("request_date"));
      visitRequest.setTimeSlot(rs.getString("time_slot"));
      visitRequest.setAddress(daoAddress.getAddressById(rs.getInt("address")));
      visitRequest.setStatus(VisitRequestStatus.values()[rs.getInt("status")]);
      visitRequest.setChosenDateTime(rs.getDate("chosen_date_time"));
      visitRequest.setCancellationReason(rs.getString("cancellation_reason"));
      visitRequest.setCustomer(this.daoUser.getUserById(rs.getInt("customer")));
    }
    return visitRequest;
  }

 */
}
