import assert from "node:assert/strict";
import test from "node:test";
import { createSalonReceipt } from "../src/services/salon-receipt.ts";

const booking = {
  id: "test-booking",
  customerName: "Test Customer",
  phoneNumber: "0771234567",
  isPaid: false,
  paidAt: null,
  paymentType: null,
  totalAmount: 1200,
  services: [{ serviceName: "Haircut", price: 1500, discountAmount: 300 }],
};

test("unpaid or undated payments cannot issue a paid receipt", () => {
  assert.throws(() => createSalonReceipt(booking), /Payment must be collected/);
  assert.throws(() => createSalonReceipt({ ...booking, isPaid: true }), /Payment must be collected/);
});

for (const [paymentType, label] of [[1, "Cash"], [2, "Card"]]) {
  test(`${label} receipt records the collected total, discount, and Sri Lanka payment time`, () => {
    const pdf = createSalonReceipt({ ...booking, isPaid: true, paidAt: "2026-10-13T15:20:00", paymentType });
    const content = Buffer.from(pdf.output("arraybuffer")).toString("latin1");
    assert.ok(content.startsWith("%PDF-"));
    for (const expected of ["Total paid", "1200.00", "1500.00", "300.00", `Payment: ${label}`, "2026-10-13 15:20:00", "Haircut"])
      assert.ok(content.includes(expected), `Receipt is missing ${expected}`);
  });
}
