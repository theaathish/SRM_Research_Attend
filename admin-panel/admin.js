// Helper function to select elements by id
function $(id) {
  return document.getElementById(id);
}

const ADMIN_EMAIL = "admin";
const ADMIN_PASSWORD = "password123";

$("adminLoginBtn").onclick = () => {
  const email = $("adminEmail").value.trim();
  const password = $("adminPassword").value.trim();

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    $("panel").style.display = "block";
    alert("✅ Admin login successful");
  } else {
    alert("❌ Invalid admin credentials");
  }
};
