interface Partnership {
  id: string; // Replace with the specific type if possible, e.g., 'number' or 'string'
  sender_id: string; // Replace with the correct type, e.g., 'number' or 'string'
  receiver_id: string; // Replace with the correct type, e.g., 'number' or 'string'
  type: string; // Replace with the correct type, e.g., 'string'
  partnershipName: string;
  durationStart: string;
  durationEnd: string;
  funding: number;
  status: string;
  sender_name: string;
  partner_name: string;
  recepient_name: string;
  details: string;
  format: string; // Assuming you missed this in the interface
  name: string; // Assuming you missed this in the interface
  kpis: Kpi[]; // Adjust the type as necessary
  // Add any other fields that might be included in your partnership records
}

export default Partnership;
