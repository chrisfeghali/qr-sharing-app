// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  push,
  update,
  onChildAdded,
  remove,
} from "firebase/database";
import { getAuth } from "firebase/auth";
// import { connectAuthEmulator } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfigString = JSON.stringify(
  process.env.REACT_APP_FIREBASE_CONFIG
);
//console.log(`Firebase config is ${firebaseConfigString}`);

let firebaseConfig = JSON.parse(JSON.parse(firebaseConfigString));

// if (window.location.hostname === "localhost") {
//   console.log(`window location hostname is ${window.location.hostname}`);
//   firebaseConfig.databaseURL = "http://localhost:9000?ns=emulatorui";
// }

// console.log(`Firebase config parsed is ${JSON.stringify(firebaseConfig)}`);

//const firebaseConfig = JSON.parse(process.env.REACT_APP_FIREBASE_CONFIG);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// if (window.location.hostname === "localhost") {
//   connectAuthEmulator(auth, "http://localhost:9099");
// }

const CreateUserInDatabase = async (userName) => {
  await set(ref(database, `users/${auth.currentUser.uid}`), {
    username: userName,
  });
};

const CreateGroup = async (groupName) => {
  const newGroupKey = push(child(ref(database), "groups")).key;
  const updates = {};
  updates[`/users/${auth.currentUser.uid}/groups/${newGroupKey}`] = true;
  updates[`/groups/${newGroupKey}/name`] = groupName;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const GetGroupName = async (groupValue) => {
  const retrievedName = await get(
    child(ref(database), `groups/${groupValue}/name`)
  );
  return retrievedName.val();
};

const GetAdmin = async (groupValue) => {
  const admin = await get(
    child(ref(database), `/users/${auth.currentUser.uid}/groups/${groupValue}`)
  );
  return admin.val();
};

const UpdateGroupName = async (groupValue, groupName) => {
  const updates = {};
  updates[`/groups/${groupValue}/name`] = groupName;
  const nameChange = await (
    await get(child(ref(database), `/nameChange/`))
  ).val();
  updates[`/nameChange/`] = !nameChange;
  const updateVal = await update(ref(database), updates);

  return updateVal;
};

const DeleteGroup = async (groupKey) => {
  await remove(ref(database, `/groups/${groupKey}`));
  await remove(
    ref(database, `/users/${auth.currentUser.uid}/groups/${groupKey}`)
  );
};

export {
  auth,
  app,
  database,
  CreateUserInDatabase,
  CreateGroup,
  GetGroupName,
  UpdateGroupName,
  ref,
  set,
  get,
  child,
  onChildAdded,
  DeleteGroup,
  GetAdmin,
};
