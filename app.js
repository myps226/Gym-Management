const SUPABASE_URL = "https://ttsfwfdkzxvstafniloc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c2Z3ZmRrenh2c3RhZm5pbG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMjU2OTYsImV4cCI6MjA4MTkwMTY5Nn0.ybiJhjVEhWfM7DmuKOt5W0sookv1MLAuJG_nhKHiwq0";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const form = document.getElementById("member-form");
const list = document.getElementById("member-list");

async function fetchMembers() {
    const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
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

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newMember = {
        full_name: full_name.value,
        age: age.value,
        gender: gender.value,
        phone: phone.value,
        email: email.value,
        membership_type: membership_type.value,
        membership_start: membership_start.value,
        membership_end: membership_end.value,
        training_level: training_level.value,
        status: "Active"
    };

    const { error } = await supabase
        .from("members")
        .insert([newMember]);

    if (error) {
        alert("Error adding member");
        console.error(error);
    } else {
        form.reset();
        fetchMembers();
    }
});

async function deleteMember(id) {
    const { error } = await supabase
        .from("members")
        .delete()
        .eq("id", id);

    if (error) {
        alert("Error deleting member");
    } else {
        fetchMembers();
    }
}

fetchMembers();
