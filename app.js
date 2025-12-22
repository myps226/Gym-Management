// ---------- SUPABASE SETUP ----------
const SUPABASE_URL = "https://ttsfwfdkzxvstafniloc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c2Z3ZmRrenh2c3RhZm5pbG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjU2OTYsImV4cCI6MjA4MTkwMTY5Nn0.ybiJhjVEhWfM7DmuKOt5W0sookv1MLAuJG_nhKHiwq0";

const { createClient } = supabase;
const supabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// ---------- DOM ELEMENTS ----------
const form = document.getElementById("member-form");
const list = document.getElementById("member-list");

const full_name = document.getElementById("full_name");
const age = document.getElementById("age");
const gender = document.getElementById("gender");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const membership_type = document.getElementById("membership_type");
const membership_start = document.getElementById("membership_start");
const membership_end = document.getElementById("membership_end");
const training_level = document.getElementById("training_level");

// ---------- FETCH MEMBERS ----------
async function fetchMembers() {
    const { data, error } = await supabaseClient
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Fetch error:", error);
        return;
    }

    list.innerHTML = "";

    data.forEach(member => {
        const row = document.createElement("tr");

        row.innerHTML = `
      <td>${member.full_name}</td>
      <td>${member.membership_type}</td>
      <td>${member.training_level}</td>
      <td>${member.status}</td>
      <td>
        <button class="delete" onclick="deleteMember('${member.id}')">
          Delete
        </button>
      </td>
    `;

        list.appendChild(row);
    });
}

// ---------- ADD MEMBER ----------
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newMember = {
        full_name: full_name.value,
        age: age.value || null,
        gender: gender.value,
        phone: phone.value,
        email: email.value,
        membership_type: membership_type.value,
        membership_start: membership_start.value || null,
        membership_end: membership_end.value || null,
        training_level: training_level.value,
        status: "Active"
    };

    const { error } = await supabaseClient
        .from("members")
        .insert([newMember]);

    if (error) {
        alert("Error adding member");
        console.error("Insert error:", error);
        return;
    }

    form.reset();
    fetchMembers();
});

// ---------- DELETE MEMBER ----------
async function deleteMember(id) {
    const { error } = await supabaseClient
        .from("members")
        .delete()
        .eq("id", id);

    if (error) {
        alert("Error deleting member");
        console.error(error);
    } else {
        fetchMembers();
    }
}

// ---------- INIT ----------
fetchMembers();
