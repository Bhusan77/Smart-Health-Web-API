"use client"

import "@/app/styles/dashboard.css"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { DoctorAPI } from "@/lib/api/doctor-api"
import { AppointmentAPI } from "@/lib/api/appointment-api"
import axiosInstance from "@/lib/api/axios"
import { startEsewaPayment } from "@/lib/api/payment/esewa"
import { getAuthTokenClient } from "@/lib/cookie-client"
import { clearAuthCookies } from "@/lib/cookie"

type Doctor = {
  _id: string
  name: string
  specialization: string
  fee: number
  phone?: string
  clinicAddress?: string
  bio?: string
  profile?: string
}

type Medicine = {
  _id: string
  name: string
  category?: string
  price: number
  stock: number
  expiryDate?: string
  description?: string
}

type CartItem = {
  medicine: Medicine
  qty: number
}

type Appointment = {
  _id: string
  doctor: Doctor | string
  patient?: any
  date: string // YYYY-MM-DD
  time: string // HH:mm
  reason?: string
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | string
  cancelReason?: string
  createdAt?: string
  updatedAt?: string
}

// ensures HH:mm (pads hour if needed)
const normalizeHHMM = (t: string) => {
  if (!t) return t
  const s = String(t).trim()

  if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s.slice(0, 5)
  if (/^\d{2}:\d{2}$/.test(s)) return s

  const m = s.match(/^(\d{1,2}):(\d{2})$/)
  if (m) return `${String(parseInt(m[1], 10)).padStart(2, "0")}:${m[2]}`
  return s
}

// ✅ combine date + time to a JS Date (local time)
const toLocalDateTime = (date: string, time: string) => {
  const t = normalizeHHMM(time)
  return new Date(`${date}T${t}:00`)
}

const getDoctorName = (x: Doctor | string) => {
  if (!x) return "Doctor"
  if (typeof x === "string") return "Doctor"
  return x.name || "Doctor"
}

const getDoctorSpec = (x: Doctor | string) => {
  if (!x) return ""
  if (typeof x === "string") return ""
  return x.specialization || ""
}

// ✅ Inline Pharmacy API
const PharmacyAPI = {
  getMedicines: async () => axiosInstance.get("/api/pharmacy/medicines"),
  createOrder: async (payload: {
    items: { medicine: string; qty: number }[]
    deliveryAddress?: string
  }) => axiosInstance.post("/api/pharmacy/orders", payload),
}

type Panel = "doctors" | "pharmacy" | null

export default function Dashboard() {
  const router = useRouter()

  // ✅ which panel open from header buttons
  const [activePanel, setActivePanel] = useState<Panel>(null)
  const togglePanel = (p: Exclude<Panel, null>) => {
    setActivePanel((prev) => (prev === p ? null : p))
  }

  // ✅ Notifications (simple demo data)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<string[]>([
    "Appointment confirmed",
    "New doctor available",
    "Medicine order delivered",
  ])

  // close dropdown when clicking outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (!t.closest(".notification-wrapper")) setShowNotifications(false)
    }
    window.addEventListener("click", onClick)
    return () => window.removeEventListener("click", onClick)
  }, [])

  // ===== Upcoming Appointments =====
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loadingAppt, setLoadingAppt] = useState(true)
  const [apptErr, setApptErr] = useState<string | null>(null)
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null)

  // upcoming filter computed
  const upcomingAppointments = useMemo(() => {
    const now = new Date()

    return appointments
      .filter((a) => {
        const status = String(a.status || "").toUpperCase()
        if (status === "CANCELLED" || status === "COMPLETED") return false

        if (!a.date || !a.time) return false

        const dt = toLocalDateTime(a.date, a.time)
        if (Number.isNaN(dt.getTime())) return false

        return dt.getTime() >= now.getTime()
      })
      .sort((a, b) => {
        const da = toLocalDateTime(a.date, a.time).getTime()
        const db = toLocalDateTime(b.date, b.time).getTime()
        return da - db
      })
      .slice(0, 6)
  }, [appointments])

  const fetchMyAppointments = async () => {
    setLoadingAppt(true)
    setApptErr(null)
    try {
      const res = await AppointmentAPI.getMine()
      setAppointments(res.data?.appointments || [])
    } catch (e: any) {
      setAppointments([])
      setApptErr(e?.response?.data?.message || e?.message || "Failed to load appointments")
    } finally {
      setLoadingAppt(false)
    }
  }

  const cancelAppointment = async (id: string) => {
    setCancelLoadingId(id)
    try {
      await AppointmentAPI.cancel(id, { cancelReason: "Cancelled by user" })
      await fetchMyAppointments()

      // add a notification (demo)
      setNotifications((prev) => ["Appointment cancelled", ...prev].slice(0, 9))
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Failed to cancel appointment")
    } finally {
      setCancelLoadingId(null)
    }
  }

  // ===== Doctors =====
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [doctorError, setDoctorError] = useState<string | null>(null)

  const [q, setQ] = useState("")
  const [specialization, setSpecialization] = useState("")

  // ===== Booking modal state =====
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [reason, setReason] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingMsg, setBookingMsg] = useState<string | null>(null)

  // ===== Pharmacy =====
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [loadingMeds, setLoadingMeds] = useState(true)
  const [medErr, setMedErr] = useState<string | null>(null)

  // Cart
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [orderMsg, setOrderMsg] = useState<string | null>(null)
  const [orderLoading, setOrderLoading] = useState(false)

  const specializations = useMemo(() => {
    const set = new Set<string>()
    doctors.forEach((d) => d.specialization && set.add(d.specialization))
    return ["", ...Array.from(set).sort()]
  }, [doctors])

  const fetchDoctors = async (search?: string, spec?: string) => {
    setLoadingDoctors(true)
    setDoctorError(null)

    try {
      const res = await DoctorAPI.getDoctors({
        q: search || undefined,
        specialization: spec || undefined,
      })
      setDoctors(res.data?.doctors || [])
    } catch (error: any) {
      setDoctors([])
      setDoctorError(error?.response?.data?.message || error?.message || "Failed to load doctors")
    } finally {
      setLoadingDoctors(false)
    }
  }

  const fetchMedicines = async () => {
    setLoadingMeds(true)
    setMedErr(null)
    try {
      const res = await PharmacyAPI.getMedicines()
      setMedicines(res.data?.medicines || [])
    } catch (e: any) {
      setMedicines([])
      setMedErr(e?.response?.data?.message || e?.message || "Failed to load medicines")
    } finally {
      setLoadingMeds(false)
    }
  }

  // ✅ only fetch appointments if token exists
  useEffect(() => {
    fetchDoctors()
    fetchMedicines()

    const token = getAuthTokenClient()
    if (token) {
      fetchMyAppointments()
    } else {
      setAppointments([])
      setLoadingAppt(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSearch = () => fetchDoctors(q.trim(), specialization)

  const onClear = () => {
    setQ("")
    setSpecialization("")
    fetchDoctors()
  }

  const openBooking = (doc: Doctor) => {
    setSelectedDoctor(doc)
    setDate("")
    setTime("")
    setReason("")
    setBookingMsg(null)
    setIsBookingOpen(true)
  }

  const closeBooking = () => {
    if (bookingLoading) return
    setIsBookingOpen(false)
    setSelectedDoctor(null)
  }

  const submitBooking = async () => {
    if (!selectedDoctor) return

    if (!date || !time) {
      setBookingMsg("Please select date and time.")
      return
    }

    const fixedTime = normalizeHHMM(time)

    if (!/^\d{2}:\d{2}$/.test(fixedTime)) {
      setBookingMsg("Invalid time format. Please pick time again.")
      return
    }

    setBookingLoading(true)
    setBookingMsg(null)

    try {
      const res = await AppointmentAPI.create({
        doctor: selectedDoctor._id,
        date,
        time: fixedTime,
        reason: reason?.trim() || undefined,
      })

      if (res.data?.success) {
        setBookingMsg("✅ Appointment booked successfully!")
        fetchMyAppointments()

        // add a notification (demo)
        setNotifications((prev) => ["Appointment booked successfully", ...prev].slice(0, 9))
      } else {
        setBookingMsg(res.data?.message || "Booking failed")
      }
    } catch (e: any) {
      setBookingMsg(e?.response?.data?.message || e?.message || "Booking failed")
    } finally {
      setBookingLoading(false)
    }
  }

  // ===== Cart helpers =====
  const addToCart = (m: Medicine) => {
    setOrderMsg(null)
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.medicine._id === m._id)
      if (idx >= 0) {
        const copy = [...prev]
        const nextQty = copy[idx].qty + 1
        if (nextQty > m.stock) return prev
        copy[idx] = { ...copy[idx], qty: nextQty }
        return copy
      }
      if (m.stock < 1) return prev
      return [...prev, { medicine: m, qty: 1 }]
    })
  }

  const incQty = (id: string) => {
    setCart((prev) =>
      prev.map((x) =>
        x.medicine._id === id ? { ...x, qty: Math.min(x.qty + 1, x.medicine.stock) } : x
      )
    )
  }

  const decQty = (id: string) => {
    setCart((prev) =>
      prev
        .map((x) => (x.medicine._id === id ? { ...x, qty: x.qty - 1 } : x))
        .filter((x) => x.qty > 0)
    )
  }

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, x) => sum + x.medicine.price * x.qty, 0)
  }, [cart])

  // ✅ Create order then redirect to eSewa
  const placeOrder = async () => {
    if (cart.length === 0) {
      setOrderMsg("Cart is empty.")
      return
    }

    const token = getAuthTokenClient()
    if (!token) {
      setOrderMsg("Please login first.")
      return
    }

    setOrderLoading(true)
    setOrderMsg(null)

    try {
      const payload = {
        items: cart.map((c) => ({ medicine: c.medicine._id, qty: c.qty })),
        deliveryAddress: deliveryAddress.trim() || undefined,
      }

      const res = await PharmacyAPI.createOrder(payload)

      if (!res.data?.success) {
        setOrderMsg(res.data?.message || "Order failed")
        return
      }

      const orderId = res.data?.order?._id
      if (!orderId) {
        setOrderMsg("Order created but orderId missing")
        return
      }

      setOrderMsg("Redirecting to eSewa...")
      setCart([])
      setDeliveryAddress("")
      fetchMedicines()

      // add a notification (demo)
      setNotifications((prev) => ["Order placed successfully", ...prev].slice(0, 9))

      await startEsewaPayment(orderId, token)
    } catch (e: any) {
      setOrderMsg(e?.response?.data?.message || e?.message || "Order failed")
    } finally {
      setOrderLoading(false)
    }
  }

  // ✅ CLEAN LOGOUT
  const handleLogout = async () => {
    try {
      await clearAuthCookies()
      document.cookie = "auth_token=; Max-Age=0; path=/"
      document.cookie = "user_data=; Max-Age=0; path=/"

      router.push("/login")
      router.refresh()
    } catch (e) {
      console.error("Logout failed:", e)
    }
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-dash">
            <div className="logo-icon-dash">⚕️</div>
            <span className="logo-text-dash">Donuki Health</span>
          </div>
        </div>

        <div className="header-right">
          <button
            className={`btn-icon nav-link-btn ${activePanel === "doctors" ? "active" : ""}`}
            onClick={() => togglePanel("doctors")}
            type="button"
          >
            Doctors
          </button>

          <button
            className={`btn-icon nav-link-btn ${activePanel === "pharmacy" ? "active" : ""}`}
            onClick={() => togglePanel("pharmacy")}
            type="button"
          >
            Pharmacy
          </button>

          {activePanel && (
            <button className="btn-icon" onClick={() => setActivePanel(null)} type="button">
              ✖
            </button>
          )}

          {/* ✅ Notifications with badge + dropdown */}
          <div className="notification-wrapper">
            <button
              className="btn-icon"
              title="Notifications"
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setShowNotifications((p) => !p)
              }}
            >
              🔔
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="notification-head">
                  <span>Notifications</span>
                  <button
                    className="notification-clear"
                    type="button"
                    onClick={() => setNotifications([])}
                  >
                    Clear
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <p className="notification-empty">No notifications</p>
                ) : (
                  notifications.map((n, i) => (
                    <div key={`${n}-${i}`} className="notification-item">
                      {n}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          

          {/* ✅ Red logout button */}
          <button className="logout-btn" onClick={handleLogout} type="button">
            Logout
          </button>

          <div className="user-profile">
            <div className="avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div className="user-info">
              <p className="user-name">User</p>
              <p className="user-role">Patient</p>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {/* ✅ Welcome + Upcoming */}
        {!activePanel && (
          <>
            <section className="welcome-section">
              <h1 className="welcome-title">Welcome Everyone!</h1>
              <p className="welcome-subtitle">Here's your health overview for today</p>
            </section>

            <section className="card doctors-card">
              <div className="card-header">
                <h2 className="card-title">Upcoming Appointments</h2>

                <button
                  className="btn-small btn-small-ghost"
                  onClick={fetchMyAppointments}
                  type="button"
                >
                  Refresh
                </button>
              </div>

              {loadingAppt ? (
                <div className="doctors-empty">Loading appointments...</div>
              ) : apptErr ? (
                <div className="doctors-empty">{apptErr}</div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="doctors-empty">No upcoming appointments.</div>
              ) : (
                <div className="doctors-grid">
                  {upcomingAppointments.map((a) => (
                    <div key={a._id} className="doctor-item">
                      <div className="doctor-avatar">📅</div>

                      <div className="doctor-details">
                        <p className="doctor-name">{getDoctorName(a.doctor)}</p>
                        <p className="doctor-spec">
                          {a.date} • {normalizeHHMM(a.time)}
                        </p>

                        <div className="doctor-meta">
                          <span className="doctor-fee">
                            {getDoctorSpec(a.doctor) || a.status || "UPCOMING"}
                          </span>
                          {a.reason ? <span className="doctor-address">{a.reason}</span> : null}
                        </div>
                      </div>

                      <button
                        className="btn-small btn-small-ghost"
                        onClick={() => cancelAppointment(a._id)}
                        disabled={cancelLoadingId === a._id}
                        type="button"
                      >
                        {cancelLoadingId === a._id ? "Cancelling..." : "Cancel"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* ✅ Doctors panel */}
        {activePanel === "doctors" && (
          <section className="card doctors-card">
            <div className="card-header">
              <h2 className="card-title">Available Doctors</h2>

              <div className="doctors-toolbar">
                <input
                  className="doctors-input"
                  placeholder="Search doctor name..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />

                <select
                  className="doctors-select"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                >
                  <option value="">All Specializations</option>
                  {specializations
                    .filter((s) => s !== "")
                    .map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                </select>

                <button className="btn-small" onClick={onSearch} type="button">
                  Search
                </button>
                <button className="btn-small btn-small-ghost" onClick={onClear} type="button">
                  Clear
                </button>
              </div>
            </div>

            {loadingDoctors ? (
              <div className="doctors-empty">Loading doctors...</div>
            ) : doctorError ? (
              <div className="doctors-empty">{doctorError}</div>
            ) : doctors.length === 0 ? (
              <div className="doctors-empty">No doctors found.</div>
            ) : (
              <div className="doctors-grid">
                {doctors.map((d) => (
                  <div key={d._id} className="doctor-item">
                    <div className="doctor-avatar">
                      {d.name?.slice(0, 1)?.toUpperCase() || "D"}
                    </div>

                    <div className="doctor-details">
                      <p className="doctor-name">{d.name}</p>
                      <p className="doctor-spec">{d.specialization}</p>

                      <div className="doctor-meta">
                        <span className="doctor-fee">Fee: Rs. {d.fee}</span>
                        {d.clinicAddress ? (
                          <span className="doctor-address">{d.clinicAddress}</span>
                        ) : null}
                      </div>
                    </div>

                    <button className="btn-small" onClick={() => openBooking(d)} type="button">
                      Book
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ✅ Pharmacy panel */}
        {activePanel === "pharmacy" && (
          <section className="card doctors-card">
            <div className="card-header">
              <h2 className="card-title">Pharmacy Medicines</h2>

              <button className="btn-small" onClick={() => setIsCartOpen(true)} type="button">
                🛒 Cart ({cart.length})
              </button>
            </div>

            {loadingMeds ? (
              <div className="doctors-empty">Loading medicines...</div>
            ) : medErr ? (
              <div className="doctors-empty">{medErr}</div>
            ) : medicines.length === 0 ? (
              <div className="doctors-empty">No medicines available.</div>
            ) : (
              <div className="doctors-grid">
                {medicines.map((m) => (
                  <div key={m._id} className="doctor-item">
                    <div className="doctor-avatar">💊</div>

                    <div className="doctor-details">
                      <p className="doctor-name">{m.name}</p>
                      <p className="doctor-spec">{m.category || "Medicine"}</p>

                      <div className="doctor-meta">
                        <span className="doctor-fee">Price: Rs. {m.price}</span>
                        <span className="doctor-address">Stock: {m.stock}</span>
                      </div>
                    </div>

                    <button
                      className="btn-small"
                      onClick={() => addToCart(m)}
                      disabled={m.stock < 1}
                      type="button"
                    >
                      {m.stock < 1 ? "Out" : "Add"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="modal-overlay" onClick={closeBooking}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                Book Appointment {selectedDoctor ? `- ${selectedDoctor.name}` : ""}
              </h3>
              <button className="btn-icon" onClick={closeBooking} type="button">
                ✖
              </button>
            </div>

            <div className="modal-body">
              <label className="modal-label">Date</label>
              <input
                className="modal-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <label className="modal-label">Time</label>
              <input
                className="modal-input"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />

              <label className="modal-label">Reason (optional)</label>
              <textarea
                className="modal-textarea"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />

              {bookingMsg && <p className="modal-msg">{bookingMsg}</p>}

              <button
                className="btn-small modal-btn"
                onClick={submitBooking}
                disabled={bookingLoading}
                type="button"
              >
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Cart Modal */}
      {isCartOpen && (
        <div className="modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Your Cart</h3>
              <button className="btn-icon" onClick={() => setIsCartOpen(false)} type="button">
                ✖
              </button>
            </div>

            <div className="modal-body">
              {cart.length === 0 ? (
                <p className="modal-msg">Cart is empty.</p>
              ) : (
                <>
                  {cart.map((c) => (
                    <div
                      key={c.medicine._id}
                      className="doctor-item"
                      style={{ marginBottom: 10 }}
                    >
                      <div className="doctor-avatar">💊</div>

                      <div className="doctor-details">
                        <p className="doctor-name">{c.medicine.name}</p>
                        <p className="doctor-spec">
                          Rs. {c.medicine.price} × {c.qty} = Rs.{" "}
                          {c.medicine.price * c.qty}
                        </p>
                      </div>

                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="btn-small"
                          onClick={() => decQty(c.medicine._id)}
                          type="button"
                        >
                          -
                        </button>
                        <button
                          className="btn-small"
                          onClick={() => incQty(c.medicine._id)}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}

                  <label className="modal-label">Delivery Address (optional)</label>
                  <input
                    className="modal-input"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Eg: Kathmandu, New Road..."
                  />

                  <p className="modal-msg">Total: Rs. {cartTotal}</p>
                  {orderMsg && <p className="modal-msg">{orderMsg}</p>}

                  <button
                    className="btn-small modal-btn"
                    onClick={placeOrder}
                    disabled={orderLoading}
                    type="button"
                  >
                    {orderLoading ? "Redirecting..." : "Place Order & Pay"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}