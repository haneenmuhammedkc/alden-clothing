import Swal from "sweetalert2"
import "animate.css"

const baseAlert = {
  background: "rgba(11, 11, 11, 0.75)",
  color: "#ffffff",
  allowOutsideClick: false
}

// Tailwind-based layout + text
const alertTemplate = (icon, type, title, text) => `
  <div class="flex flex-col items-center gap-3 text-center alden-alert">
    <div class="alden-icon ${type}">${icon}</div>
    <h2 class="text-[22px] font-semibold tracking-wide">${title}</h2>
    <p class="text-sm text-gray-400">${text}</p>
  </div>
`

export const showSuccess = (title, text, timer = 2200) =>
  Swal.fire({
    ...baseAlert,
    timer,
    showConfirmButton: false,
    html: alertTemplate("✓", "success", title, text),
    showClass: { popup: "animate__animated animate__zoomIn" },
    hideClass: { popup: "animate__animated animate__fadeOut" }
  })

export const showError = (title, text) =>
  Swal.fire({
    ...baseAlert,
    showConfirmButton: true,
    confirmButtonText: "Okay",
    html: alertTemplate("✕", "error", title, text),
    showClass: { popup: "animate__animated animate__shakeX" }
  })

export const showInfo = (title, text) =>
  Swal.fire({
    ...baseAlert,
    timer: 2000,
    showConfirmButton: false,
    html: alertTemplate("i", "info", title, text),
    showClass: { popup: "animate__animated animate__fadeIn" }
  })

export const showConfirm = (title, text, confirmText = "Yes") =>
  Swal.fire({
    ...baseAlert,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancel",
    html: alertTemplate("!", "warn", title, text)
  })

export const showLoading = (title = "Processing...") =>
  Swal.fire({
    ...baseAlert,
    title,
    showConfirmButton: false,
    didOpen: () => Swal.showLoading()
  })