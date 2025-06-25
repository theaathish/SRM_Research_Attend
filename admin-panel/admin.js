// Helper function to select elements by id
function $(id) {
  return document.getElementById(id);
}

// Initialize Firebase (only if not already initialized)
const firebaseConfig = {
  apiKey: "AIzaSyD-EGtOlBWDOIjLiqymHR2EbCfcns-PI94",
  authDomain: "attandance-srm.firebaseapp.com",
  projectId: "attandance-srm",
  storageBucket: "attandance-srm.appspot.com",
  messagingSenderId: "730018146358",
  appId: "1:730018146358:web:072a85bd0e4a8317471097"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

$("adminLoginBtn").onclick = () => {
  const username = $("adminUsername").value.trim();
  const password = $("adminPassword").value.trim();

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    $("adminLoginForm").style.display = "none";
    $("panel").style.display = "block";
    $("adminUsername").value = "";
    $("adminPassword").value = "";
    $("adminLoginBtn").disabled = true;
    $("output").innerText = "Admin login successful.";
    loadUsers();
  } else {
    $("output").innerText = "❌ Invalid admin credentials";
  }
};

// Create User
$("createUserBtn").onclick = async () => {
  const name = $("name").value.trim();
  const register = $("register").value.trim();
  const department = $("department").value.trim();
  const email = $("email").value.trim();
  const phone = $("phone").value.trim();
  const password = $("password").value.trim();
  const usertype = $("usertype").value;

  if (!name || !email || !password) {
    $("output").innerText = "Name, Email, and Password are required.";
    return;
  }

  try {
    // Create user in Firebase Auth
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const userId = userCredential.user.uid;

    // Add user details to Firestore
    await db.collection(usertype).doc(userId).set({
      name,
      register,
      department,
      email,
      phone,
      usertype,
      uid: userId
    });

    $("output").innerText = "✅ User created successfully!";
    $("createUserForm").reset();
    loadUsers(); // Refresh user list
  } catch (error) {
    $("output").innerText = "❌ " + error.message;
  }
};

// Load users (students and staff) and display in a table
async function loadUsers() {
  $("output").innerHTML = "";
  const types = ["Student", "Staff"];
  let tableHTML = `
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow text-sm">
        <thead>
          <tr class="bg-blue-100 text-blue-900">
            <th class="py-3 px-4 border-b text-left">Type</th>
            <th class="py-3 px-4 border-b text-left">Name</th>
            <th class="py-3 px-4 border-b text-left">Email</th>
            <th class="py-3 px-4 border-b text-left">Register</th>
            <th class="py-3 px-4 border-b text-left">Department</th>
            <th class="py-3 px-4 border-b text-left">Phone</th>
            <th class="py-3 px-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
  `;
  let hasUsers = false;
  for (const type of types) {
    const snapshot = await db.collection(type).get();
    snapshot.forEach(docSnap => {
      hasUsers = true;
      const data = docSnap.data();
      tableHTML += `
        <tr class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b align-middle">${data.usertype}</td>
          <td class="py-2 px-4 border-b align-middle">${data.name}</td>
          <td class="py-2 px-4 border-b align-middle">${data.email}</td>
          <td class="py-2 px-4 border-b align-middle">${data.register || ""}</td>
          <td class="py-2 px-4 border-b align-middle">${data.department || ""}</td>
          <td class="py-2 px-4 border-b align-middle">${data.phone || ""}</td>
          <td class="py-2 px-4 border-b align-middle">
            <div class="flex flex-col md:flex-row gap-2 justify-center">
              <button class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs font-semibold" onclick="editUserUI('${type}','${data.uid}')">Edit</button>
              <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold" onclick="deleteUserHandler('${type}','${data.uid}')">Delete</button>
            </div>
          </td>
        </tr>
      `;
    });
  }
  tableHTML += `
        </tbody>
      </table>
    </div>
  `;
  if (!hasUsers) {
    $("output").innerHTML = "<div class='text-gray-500 text-center py-4'>No users found.</div>";
  } else {
    $("output").innerHTML = tableHTML;
  }
}

// Edit user UI (inline form, no popup)
window.editUserUI = async (type, uid) => {
  // Find the row and replace with editable inputs
  const row = Array.from(document.querySelectorAll("button"))
    .find(btn => btn.getAttribute("onclick") === `editUserUI('${type}','${uid}')`)
    ?.closest("tr");
  if (!row) return;

  // Get current values
  const tds = row.querySelectorAll("td");
  const current = {
    name: tds[1].innerText,
    email: tds[2].innerText,
    register: tds[3].innerText,
    department: tds[4].innerText,
    phone: tds[5].innerText
  };

  row.innerHTML = `
    <td class="py-2 px-4 border-b align-middle">${type}</td>
    <td class="py-2 px-4 border-b align-middle"><input type="text" value="${current.name}" class="border px-2 py-1 rounded w-full" id="editName"></td>
    <td class="py-2 px-4 border-b align-middle">${current.email}</td>
    <td class="py-2 px-4 border-b align-middle"><input type="text" value="${current.register}" class="border px-2 py-1 rounded w-full" id="editRegister"></td>
    <td class="py-2 px-4 border-b align-middle"><input type="text" value="${current.department}" class="border px-2 py-1 rounded w-full" id="editDepartment"></td>
    <td class="py-2 px-4 border-b align-middle"><input type="text" value="${current.phone}" class="border px-2 py-1 rounded w-full" id="editPhone"></td>
    <td class="py-2 px-4 border-b align-middle">
      <div class="flex flex-col md:flex-row gap-2 justify-center">
        <button class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold" id="saveEditBtn">Save</button>
        <button class="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs font-semibold" id="cancelEditBtn">Cancel</button>
      </div>
    </td>
  `;

  document.getElementById("saveEditBtn").onclick = async () => {
    const name = document.getElementById("editName").value.trim();
    const register = document.getElementById("editRegister").value.trim();
    const department = document.getElementById("editDepartment").value.trim();
    const phone = document.getElementById("editPhone").value.trim();
    try {
      await db.collection(type).doc(uid).update({ name, register, department, phone });
      $("output").innerText = "User updated!";
      loadUsers();
    } catch (error) {
      $("output").innerText = "❌ " + error.message;
    }
  };

  document.getElementById("cancelEditBtn").onclick = () => {
    loadUsers();
  };
};

// Delete user (no popup, just inline feedback)
window.deleteUserHandler = async (type, uid) => {
  try {
    await db.collection(type).doc(uid).delete();
    $("output").innerText = "User deleted!";
    loadUsers();
  } catch (error) {
    $("output").innerText = "❌ " + error.message;
  }
};

