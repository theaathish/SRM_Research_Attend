import { auth, db } from './firebase.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import {
  doc,
  setDoc
} from "firebase/firestore";

const $ = id => document.getElementById(id);

$("adminLoginBtn").onclick = async () => {
  try {
    const email = $("adminEmail").value;
    const password = $("adminPassword").value;
    await signInWithEmailAndPassword(auth, email, password);
    $("panel").style.display = "block";
    alert("Admin login success");
  } catch (err) {
    alert("Login failed: " + err.message);
  }
};

$("createUserBtn").onclick = async () => {
  const name = $("name").value;
  const register = $("register").value;
  const department = $("department").value;
  const email = $("email").value;
  const phone = $("phone").value;
  const password = $("password").value;
  const usertype = $("usertype").value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    await setDoc(doc(db, "users", uid), {
      name,
      register_number: register,
      department,
      email,
      phone,
      userType: usertype,
      uid
    });

    $("output").innerText = `✅ Created user: ${email}`;
  } catch (err) {
    $("output").innerText = `❌ Error: ${err.message}`;
  }
};
