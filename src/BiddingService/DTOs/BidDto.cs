namespace BiddingService.DTOs;

public class BidDto
{
  public required string Id { get; set; }
  public required string AuctionId { get; set; }
  public required string Bidder { get; set; }
  public DateTime BidTime { get; set; } = DateTime.UtcNow;
  public int Amount { get; set; }
  public required string bidStatus { get; set; }
}
