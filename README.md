# 🩺 CareSlot – Appointment Management System

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-7952B3?logo=bootstrap&logoColor=white)
![Storage](https://img.shields.io/badge/Storage-localStorage-0f5c68)
![Backend](https://img.shields.io/badge/Backend-None-lightgrey)

**CareSlot** is a single-page web app for a small clinic's reception desk. Book patient appointments, catch double bookings automatically, search and filter the schedule, reschedule or cancel visits, and see live statistics, all without a server or database.

> 📸 **Screenshot:** add one here, e.g. `![CareSlot screenshot](screenshots/home.png)`

---

## ✨ Features

| Area | What it does |
|---|---|
| **Book appointments** | Patient name, phone, doctor, date, time and optional notes |
| **Smart validation** | Custom checks with clear error messages and red-highlighted fields |
| **Double-booking prevention** | Blocks two active bookings for the same doctor, date and time |
| **Past-time protection** | Rejects bookings earlier than the current date and time |
| **Live statistics** | Total, Upcoming, Completed and Cancelled counts update instantly |
| **Search and filter** | Search by patient or doctor while typing; filter by status |
| **Edit / reschedule** | Load any appointment back into the form and change it |
| **Status management** | Mark Upcoming appointments as Completed or Cancelled |
| **Delete with confirmation** | Remove a record after a confirmation prompt |
| **Persistent data** | Saved in the browser's `localStorage`, so it survives a refresh |
| **Responsive design** | Works from 320 px phones to wide desktop monitors |
| **Safe output** | All typed text is escaped, so injected code is shown as text and never run |

---

## 🛠️ Tech Stack

- **HTML5**: semantic structure (`nav`, `header`, `main`, `section`, `footer`)
- **CSS3**: custom properties, Flexbox, media queries, keyframe animation
- **JavaScript (ES6)**: DOM manipulation, event delegation, regex validation
- **Bootstrap 5.3.3**: grid, forms, table and utility classes (via CDN)
- **Google Fonts**: DM Sans (body) and Fraunces (headings)
- **Browser `localStorage`**: data persistence

---

## 📁 Project Structure

```
careslot/
├── index.html    # Structure: form, table, stat cards, buttons
├── style.css     # Looks: colours, fonts, spacing, animation
├── script.js     # Behaviour: validate, save, edit, search, render
└── README.md
```

---

## 🚀 Getting Started

No installation or build step is needed.

1. **Clone or download** the repository
```bash
   git clone https://github.com/<your-username>/careslot.git
   cd careslot
```
2. **Open `index.html`** in any modern browser (Chrome, Firefox, Edge or Safari).

> 🌐 An internet connection is needed the first time, to load Bootstrap and Google Fonts from their CDNs. Appointment data never leaves your browser.

**Optional: host it free with GitHub Pages:** *Settings → Pages → Deploy from branch → `main` / root.*

---

## 📖 How to Use

1. **Book:** fill in the form on the left and click **Save appointment**. The new row flashes in the table.
2. **Search / filter:** type a patient or doctor name, or pick a status from the dropdown.
3. **Complete or cancel:** use the ✔ or ✖ button on an Upcoming row.
4. **Reschedule:** click ✎, change the date or time, then **Update appointment** (or **Cancel edit**).
5. **Delete:** click 🗑 and confirm.

---

## ✅ Validation Rules

Checks run in this order and stop at the first failure.

| # | Check | Rule | Message |
|---|---|---|---|
| 1 | Name | At least 2 characters | *Enter the patient's full name.* |
| 2 | Phone | `^[6-9]\d{9}$` (10-digit Indian mobile) | *Enter a valid 10-digit mobile number.* |
| 3 | Doctor | An option is selected | *Choose a doctor or service.* |
| 4 | Date | A date is chosen | *Pick a date.* |
| 5 | Time | A time is chosen | *Pick a time.* |
| 6 | Not in the past | Date + time is not earlier than now | *That time has already passed. Choose a future slot.* |
| 7 | No clash | No other non-cancelled booking for the same doctor, date and time | *[Doctor] is already booked at that time. Choose another slot.* |

---

## 🗂️ Data Model

Each appointment is stored as a JSON object under the key `careslot_appointments`:

```json
{
  "id": "1760000000000",
  "name": "Riya Sharma",
  "phone": "9876543210",
  "doctor": "Dr. Khan – Dentist",
  "date": "2026-10-12",
  "time": "14:30",
  "notes": "Tooth pain",
  "status": "Upcoming"
}
```

`status` is one of **Upcoming**, **Completed** or **Cancelled**.

---

## 🧠 How It Works

- `render()` rebuilds the table from the saved array on every change: filter → sort by date and time → draw rows.
- **Event delegation:** one click listener on the table body handles every edit, complete, cancel and delete button.
- A **hidden field** (`editId`) tells the submit handler whether to create a new record or update an existing one.
- `escapeHTML()` sanitises all user-typed text before it is placed in the page (XSS protection).

---

## ♿ Accessibility

- Every form field has a connected `<label>`
- Search and filter have `aria-label`; the error box uses `role="alert"`
- Status badges carry text, not colour alone
- Fully keyboard usable, with visible focus outlines
- Animations switch off when the system's *reduce motion* setting is on

---

## ⚠️ Known Limitations

This is a front-end prototype, so some things are deliberately out of scope:

- **No login, no server:** data lives only in one browser on one device and is stored as plain text, so use sample data only
- The double-booking check compares **exact times only** (10:00 and 10:10 for one doctor are both allowed)
- The date picker minimum uses the **UTC date**, which in India can show yesterday for a few hours after midnight
- Past appointments **cannot be edited**, because the past-time check also applies to edits
- Upcoming appointments are **not auto-completed** when their time passes
- Damaged `localStorage` data stops the page from starting until site data is cleared

---

## 🔮 Future Enhancements

- Staff and doctor login, with a shared database
- SMS and email reminders
- Slot grid with appointment length and doctor working hours
- Patient self-booking and patient records
- Export to CSV and printable daily list
- Dark mode, plus reports and analytics

---

## 👩‍💻 Author

**Riddhi Tanwar**
B.Tech CSE, 3rd Semester, GLA University, Greater Noida Campus
Subject: Frontend Engineering
Project Guide: Mr. Gautam Mukherjee

---

## 📄 License

Add a license of your choice (for example MIT) if you plan to share this project publicly.
