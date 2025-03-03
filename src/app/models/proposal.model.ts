export interface Proposal {
  id: number;
  itemId: number;
  proposedBy: number;
  paymentRatios: { [partyId: number]: number }; // Percentage split for each party
  message?: string; // Required for counter-proposals
  acceptedBy: number[];
  rejectedBy: number[];
  createdAt: Date;
}