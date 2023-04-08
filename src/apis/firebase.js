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
  serverTimestamp,
} from "firebase/database";
import { getAuth } from "firebase/auth";
// import { connectAuthEmulator } from "firebase/auth";
import { xxhash128 } from "hash-wasm";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfigString = JSON.stringify(
  process.env.REACT_APP_FIREBASE_CONFIG
);
//console.log(`Firebase config is ${firebaseConfigString}`);

let firebaseConfig = JSON.parse(JSON.parse(firebaseConfigString));

// if (window.location.hostname === "localhost") {
//   console.log(`window location hostname is ${window.location.hostname}`);
//   firebaseConfig.databaseURL =
//     "http://localhost:9000?ns=qr-sharing-bfd1c-default-rtdb";
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

const CreateUserInDatabase = async (uid, userName) => {
  await set(ref(database, `users/${uid}`), {
    username: userName,
  });
};

const CreateGroup = async (groupName) => {
  const newGroupKey = push(child(ref(database), "groups")).key;
  const updates = {};
  updates[`/users/${auth.currentUser.uid}/groups/${newGroupKey}`] = true;
  updates[`/groups/${newGroupKey}/name`] = groupName;
  updates[`/groups/${newGroupKey}/members/${auth.currentUser.uid}`] = true;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const GetGroupName = async (groupKey) => {
  const retrievedName = await get(
    child(ref(database), `groups/${groupKey}/name`)
  );
  return retrievedName.val();
};

const GetGroupAdmin = async (groupKey) => {
  const admin = await get(
    child(ref(database), `/users/${auth.currentUser.uid}/groups/${groupKey}`)
  );
  return admin.val();
};

const UpdateGroupName = async (groupKey, groupName) => {
  const updates = {};
  updates[`/groups/${groupKey}/name`] = groupName;
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

const CreateKey = async (string) => await xxhash128(string);

const CreateCode = async (code) => {
  const codeKey = await CreateKey(code.val);
  const updates = {};
  updates[`/users/${auth.currentUser.uid}/codes/${codeKey}`] = true;
  updates[`/codes/${codeKey}`] = code;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const UpdateCode = async (codeKey, code) => {
  const updates = {};
  updates[`/codes/${codeKey}`] = code;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const DeleteCode = async (codeKey) => {
  const groups = await get(child(ref(database), `/codes/${codeKey}/groups`));
  console.log(groups);
  groups.forEach(async (groupKey) => {
    await remove(ref(database, `/groups/${groupKey}/codes/${codeKey}`));
  });
  await remove(ref(database, `/codes/${codeKey}`));
  await remove(
    ref(database, `/users/${auth.currentUser.uid}/codes/${codeKey}`)
  );
};

const AddCodeToGroup = async (codeKey, groupKey) => {
  const updates = {};
  updates[`/codes/${codeKey}/groups/${groupKey}`] = true;
  updates[`/groups/${groupKey}/codes/${codeKey}`] = true;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const RemoveCodeToGroup = async (codeKey, groupKey) => {
  const updates = {};
  updates[`/codes/${codeKey}/groups/${groupKey}`] = null;
  updates[`/groups/${groupKey}/codes/${codeKey}`] = null;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const GetCodeName = async (codeKey) => {
  const retrievedName = await get(
    child(ref(database), `codes/${codeKey}/name`)
  );
  return retrievedName.val();
};

const GetCodeAdmin = async (codeKey) => {
  const admin = await get(
    child(ref(database), `/users/${auth.currentUser.uid}/codes/${codeKey}`)
  );
  return admin.val();
};

const CreateInviteCode = async (groupKey) => {
  const inviteKey = push(child(ref(database), "invites")).key;
  const updates = {};
  updates[`/invites/${inviteKey}`] = groupKey;
  updates[`/groups/${groupKey}/invites/${inviteKey}`] = serverTimestamp();
  await update(ref(database), updates);
  return inviteKey;
};

const DeleteInviteCode = async (groupKey, inviteKey) => {
  const updates = {};
  updates[`/invites/${inviteKey}`] = null;
  updates[`/groups/${groupKey}/invites/${inviteKey}`] = null;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const AddUserToGroup = async (joinCode) => {
  const groupKey = (
    await get(child(ref(database), `/invites/${joinCode}`))
  ).val();

  //Check if already part of group
  const alreadyJoined = (
    await get(
      child(ref(database), `/users/${auth.currentUser.uid}/groups/${groupKey}`)
    )
  ).exists();
  if (!alreadyJoined) {
    let updates = {};
    updates[`/users/${auth.currentUser.uid}/groups/${groupKey}`] = false;
    await update(ref(database), updates);
    updates = {};
    updates[`/groups/${groupKey}/members/${auth.currentUser.uid}`] = false;
    updates[`/groups/${groupKey}/invites/${joinCode}`] = null;
    updates[`/invites/${joinCode}`] = null;
    const updateVal = await update(ref(database), updates);
    return updateVal;
  }
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
  GetGroupAdmin,
  CreateCode,
  UpdateCode,
  DeleteCode,
  GetCodeName,
  GetCodeAdmin,
  AddCodeToGroup,
  RemoveCodeToGroup,
  CreateInviteCode,
  DeleteInviteCode,
  AddUserToGroup,
};
