// ---------- State ----------
const STORAGE_KEY = "careslot_appointments";
let appointments = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ---------- Element references ----------
const form = document.getElementById("appointmentForm");
const tableBody = document.getElementById("tableBody");
const emptyMsg = document.getElementById("emptyMsg");
const errorBox = document.getElementById("formError");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const cancelEditBtn = document.getElementById("cancelEdit");

const fields = {
  id: document.getElementById("editId"),
  name: document.getElementById("name"),
  phone: document.getElementById("phone"),
  doctor: document.getElementById("doctor"),
  date: document.getElementById("date"),
  time: document.getElementById("time"),
  notes: document.getElementById("notes"),
};

// Do not allow booking in the past
fields.date.min = new Date().toISOString().split("T")[0];

// ---------- Helpers ----------
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateStr, timeStr) {
  const d = new Date(`${dateStr}T${timeStr}`);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
         ", " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function showError(message, badFields = []) {
  errorBox.textContent = message;
  errorBox.classList.remove("d-none");
  Object.values(fields).forEach(f => f.classList.remove("is-invalid"));
  badFields.forEach(f => fields[f].classList.add("is-invalid"));
}

function clearError() {
  errorBox.classList.add("d-none");
  Object.values(fields).forEach(f => f.classList.remove("is-invalid"));
}

// ---------- Validation ----------
function validate(data) {
  if (data.name.length < 2) return ["Enter the patient's full name.", ["name"]];
  if (!/^[6-9]\d{9}$/.test(data.phone)) return ["Enter a valid 10-digit mobile number.", ["phone"]];
  if (!data.doctor) return ["Choose a doctor or service.", ["doctor"]];
  if (!data.date) return ["Pick a date.", ["date"]];
  if (!data.time) return ["Pick a time.", ["time"]];

  if (new Date(`${data.date}T${data.time}`) < new Date()) {
    return ["That time has already passed. Choose a future slot.", ["date", "time"]];
  }

  // Prevent double booking for the same doctor, date and time
  const clash = appointments.find(a =>
    a.id !== data.id && a.doctor === data.doctor && a.date === data.date &&
    a.time === data.time && a.status !== "Cancelled");
  if (clash) return [`${data.doctor} is already booked at that time. Choose another slot.`, ["doctor", "time"]];

  return null;
}

// ---------- Create / Update ----------
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    id: fields.id.value || String(Date.now()),
    name: fields.name.value.trim(),
    phone: fields.phone.value.trim(),
    doctor: fields.doctor.value,
    date: fields.date.value,
    time: fields.time.value,
    notes: fields.notes.value.trim(),
    status: "Upcoming",
  };

  const problem = validate(data);
  if (problem) return showError(problem[0], problem[1]);

  clearError();

  if (fields.id.value) {
    const i = appointments.findIndex(a => a.id === data.id);
    data.status = appointments[i].status;
    appointments[i] = data;
  } else {
    appointments.push(data);
  }

  save();
  resetForm();
  render(data.id);
});

function resetForm() {
  form.reset();
  fields.id.value = "";
  document.getElementById("formTitle").textContent = "Book an appointment";
  document.getElementById("saveBtn").textContent = "Save appointment";
  cancelEditBtn.classList.add("d-none");
  clearError();
}

cancelEditBtn.addEventListener("click", resetForm);

// ---------- Row actions ----------
function editAppointment(id) {
  const a = appointments.find(x => x.id === id);
  Object.keys(fields).forEach(key => (fields[key].value = a[key] ?? ""));
  document.getElementById("formTitle").textContent = "Edit appointment";
  document.getElementById("saveBtn").textContent = "Update appointment";
  cancelEditBtn.classList.remove("d-none");
  document.getElementById("book").scrollIntoView({ behavior: "smooth" });
}

function setStatus(id, status) {
  const a = appointments.find(x => x.id === id);
  a.status = status;
  save();
  render();
}

function deleteAppointment(id) {
  if (!confirm("Delete this appointment permanently?")) return;
  appointments = appointments.filter(a => a.id !== id);
  save();
  render();
}

// Event delegation: one listener handles every button in the table
tableBody.addEventListener("click", function (e) {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const { action, id } = btn.dataset;
  if (action === "edit") editAppointment(id);
  if (action === "done") setStatus(id, "Completed");
  if (action === "cancel") setStatus(id, "Cancelled");
  if (action === "delete") deleteAppointment(id);
});

// ---------- Render ----------
function render(highlightId) {
  const term = searchInput.value.toLowerCase();
  const status = filterSelect.value;

  const visible = appointments
    .filter(a => status === "all" || a.status === status)
    .filter(a => a.name.toLowerCase().includes(term) || a.doctor.toLowerCase().includes(term))
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  tableBody.innerHTML = visible.map(a => `
    <tr class="${a.id === highlightId ? "row-new" : ""}">
      <td><strong>${escapeHTML(a.name)}</strong><br><small>${escapeHTML(a.phone)}</small></td>
      <td>${escapeHTML(a.doctor)}</td>
      <td>${formatDate(a.date, a.time)}${a.notes ? `<br><small>${escapeHTML(a.notes)}</small>` : ""}</td>
      <td><span class="status-badge badge-${a.status}">${a.status}</span></td>
      <td class="text-end text-nowrap">
        ${a.status === "Upcoming" ? `
          <button class="act" data-action="done" data-id="${a.id}" title="Mark completed">✔</button>
          <button class="act" data-action="cancel" data-id="${a.id}" title="Cancel appointment">✖</button>` : ""}
        <button class="act" data-action="edit" data-id="${a.id}" title="Edit">✎</button>
        <button class="act del" data-action="delete" data-id="${a.id}" title="Delete">🗑</button>
      </td>
    </tr>`).join("");

  emptyMsg.classList.toggle("d-none", visible.length > 0);
  emptyMsg.textContent = appointments.length
    ? "No appointments match your search."
    : "No appointments yet. Use the form to book the first one.";

  updateStats();
}

function updateStats() {
  const count = s => appointments.filter(a => a.status === s).length;
  document.getElementById("statTotal").textContent = appointments.length;
  document.getElementById("statUpcoming").textContent = count("Upcoming");
  document.getElementById("statDone").textContent = count("Completed");
  document.getElementById("statCancelled").textContent = count("Cancelled");
}

searchInput.addEventListener("input", () => render());
filterSelect.addEventListener("change", () => render());

render();