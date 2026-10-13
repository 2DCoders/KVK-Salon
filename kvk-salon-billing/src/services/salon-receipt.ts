import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

type ReceiptBooking = {
  id: string;
  customerName: string;
  phoneNumber: string;
  isPaid: boolean;
  paidAt: string | null;
  paymentType: number | null;
  totalAmount: number;
  services: { serviceName: string; price: number; discountAmount: number }[];
};

export const createSalonReceipt = (booking: ReceiptBooking) => {
  if (!booking.isPaid || !booking.paidAt) throw new Error("Payment must be collected before issuing a receipt.");
  const doc = new jsPDF();
  const money = (amount: number) => `LKR ${amount.toFixed(2)}`;
  doc.setFontSize(18);
  doc.text("KVK Salon - Payment Receipt", 14, 20);
  doc.setFontSize(10);
  doc.text(`Receipt: ${booking.id}`, 14, 30);
  doc.text(`Paid at: ${booking.paidAt.replace("T", " ").slice(0, 19)} (Sri Lanka)`, 14, 37);
  doc.text(`Customer: ${booking.customerName}`, 14, 44);
  doc.text(`Phone: ${booking.phoneNumber || "-"}`, 14, 51);
  doc.text(`Payment: ${booking.paymentType === 1 ? "Cash" : "Card"}`, 14, 58);
  autoTable(doc, {
    startY: 65,
    head: [["Service", "Price", "Discount"]],
    body: booking.services.map((service) => [service.serviceName, money(service.price), money(service.discountAmount)]),
    foot: [["Total paid", money(booking.totalAmount), ""]],
    theme: "striped",
  });
  return doc;
};

export const downloadSalonReceipt = (booking: ReceiptBooking) => {
  createSalonReceipt(booking).save(`salon-receipt-${booking.id}.pdf`);
};
