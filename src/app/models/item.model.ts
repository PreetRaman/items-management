export interface Item {
  id: number;
  name: string;
  description: string;
  totalCost: number;
  ownerIds: number[]; // Parties sharing the item
}