// ==============================
// SUPABASE SETUP
// ==============================
const SUPABASE_URL = "https://ttsfwfdkzxvstafniloc.supabase.co";
const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c2Z3ZmRrenh2c3RhZm5pbG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjU2OTYsImV4cCI6MjA4MTkwMTY5Nn0.ybiJhjVEhWfM7DmuKOt5W0sookv1MLAuJG_nhKHiwq0";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==============================
// DOM ELEMENTS
// ==============================
const form = document.getElementById("member-form");
const full_name = document.getElementById("full_name");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const membership_type = document.getElementById("membership_type");
const membership_start = document.getElementById("membership_start");
const membership_end = document.getElementById("membership_end");
const training_level = document.getElementById("training_level");
const status = document.getElementById("status");
const genderInputs = document.querySelectorAll('input[name="gender"]');

// ==============================
// DATE DEFAULTS
// ==============================
const today = new Date();
membership_start.value = today.toISOString().split("T")[0];

function updateEndDate() {
    const start = new Date(membership_start.value);
    if (isNaN(start)) return;

    start.setMonth(start.getMonth() + 1);
    membership_end.value = start.toISOString().split("T")[0];
}

updateEndDate();
membership_start.addEventListener("change", updateEndDate);

// ==============================
// HELPERS
// ==============================
function getGender() {
    for (const g of genderInputs) {
        if (g.checked) return g.value;
    }
    return null;
}

// ==============================
// SUBMIT
// ==============================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
        full_name: full_name.value.trim(),
        gender: getGender(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        membership_type: membership_type.value,
        membership_start: membership_start.value,
        membership_end: membership_end.value,
        training_level: training_level.value,
        status: status.value
    };

    console.log("Submitting:", payload);

    const { error } = await supabaseClient
        .from("members")
        .insert([payload]);

    if (error) {
        console.error("Supabase error:", error);
        alert("Failed to register member. Check console.");
        return;
    }

    alert("Member registered successfully!");
    form.reset();
    membership_start.value = today.toISOString().split("T")[0];
    updateEndDate();
});
