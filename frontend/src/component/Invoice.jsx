import React, { forwardRef } from "react"

const Invoice = forwardRef(({ order }, ref) => {
  if (!order) return null

  return (
    <div ref={ref} style={{ minHeight: "1120px", padding: "40px", background: "#ffffff", color: "#000", boxSizing: "border-box" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <div>
          <h1 style={{ fontSize: "22px", marginBottom: "4px" }}>INVOICE</h1>
          <p>Order ID: {order._id}</p>
          <p>Date: {new Date(order.createdAt).toDateString()}</p>
        </div>

        <div style={{ textAlign: "right" }}>
          <h2>ALDEN</h2>
          <p>Alden Collections Pvt Ltd</p>
        </div>
      </div>

      {/* Customer */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <div>
          <h3>Billed To</h3>
          <p>
            {order.customer.firstName} {order.customer.lastName}<br />
            {order.customer.address.line}<br />
            {order.customer.address.city}, {order.customer.address.state}<br />
            {order.customer.address.pincode}<br />
            Phone: {order.customer.phone}
          </p>
        </div>

        <div>
          <h3>Payment</h3>
          <p>
            Method: {order.paymentMethod}<br />
            Status: {order.paymentStatus}
          </p>
        </div>
      </div>

      {/* Items */}
      <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse", marginBottom: "30px" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th align="left" style={{ border: "1px solid #ddd" }}>Item</th>
            <th align="center" style={{ border: "1px solid #ddd" }}>Qty</th>
            <th align="right" style={{ border: "1px solid #ddd" }}>Price</th>
            <th align="right" style={{ border: "1px solid #ddd" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #ddd" }}>{item.name}</td>
              <td align="center" style={{ border: "1px solid #ddd" }}>{item.quantity}</td>
              <td align="right" style={{ border: "1px solid #ddd" }}>₹ {item.price}</td>
              <td align="right" style={{ border: "1px solid #ddd" }}>
                ₹ {item.price * item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ width: "300px", marginLeft: "auto" }}>
        <p>Subtotal: ₹ {order.subtotal}</p>
        <p>Tax: ₹ {order.tax}</p>
        <p>Shipping: ₹ {order.shipping}</p>
        <hr />
        <p><strong>Total: ₹ {order.total}</strong></p>
      </div>

      <p style={{ marginTop: "40px", fontSize: "12px", textAlign: "center" }}> This is a computer-generated invoice. </p>
    </div>
  )
})

export default Invoice