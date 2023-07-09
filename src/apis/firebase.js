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
  query,
  runTransaction,
  increment,
  equalTo,
  orderByChild,
  orderByValue,
} from "firebase/database";
import { getAuth } from "firebase/auth";
// import { connectAuthEmulator } from "firebase/auth";
import { xxhash128 } from "hash-wasm";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfigString = JSON.stringify(
  process.env.REACT_APP_FIREBASE_CONFIG
);

let firebaseConfig = JSON.parse(JSON.parse(firebaseConfigString));

//local dev
// if (window.location.hostname === "localhost") {
//   //console.log(`window location hostname is ${window.location.hostname}`);
//   firebaseConfig.databaseURL =
//     "http://localhost:9000?ns=qr-sharing-bfd1c-default-rtdb";
// }

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

//local dev
// if (window.location.hostname === "localhost") {
//   connectAuthEmulator(auth, "http://localhost:9099");
// }

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6Lc7iWYmAAAAAFiGanrthnv4PMzG789gOgB_I4j4"),
  isTokenAutoRefreshEnabled: true,
});

const CreateUserInDatabase = async (uid, userName, email) => {
  const updates = {};
  updates[`/users/${uid}/username`] = userName;
  updates[`/users/${uid}/email`] = email;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const CreateGroup = async (groupName) => {
  const newGroupKey = push(child(ref(database), "groups")).key;
  const updates = {};
  updates[`/users/${auth.currentUser.uid}/groups/${newGroupKey}`] = true;
  updates[`/groups/${newGroupKey}/name`] = groupName;
  updates[`/groups/${newGroupKey}/members/${auth.currentUser.uid}`] = true;
  updates[`/groups/${newGroupKey}/reserveTime`] = 10;
  updates[`/groups/${newGroupKey}/minutesBetweenUses`] = 30;
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
    child(ref(database), `/groups/${groupKey}/members/${auth.currentUser.uid}`)
  );
  return admin.val();
};

const GetGroupReserveTime = async (groupKey) => {
  const reserveTime = await get(
    child(ref(database), `groups/${groupKey}/reserveTime`)
  );

  return reserveTime.val();
};

const GetGroupMinutesBetweenUses = async (groupKey) => {
  const minutesBetweenUses = await get(
    child(ref(database), `groups/${groupKey}/minutesBetweenUses`)
  );
  return minutesBetweenUses.val();
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
  await DeleteAllInvites(groupKey);

  const memberQuery = query(ref(database, `groups/${groupKey}/members`));
  let members = (await get(memberQuery)).val();

  delete members[auth.currentUser.uid];

  if (!!members) {
    for (const [memberKey] of Object.entries(members)) {
      //console.log(memberKey);
      await RemoveMemberfromGroup(groupKey, memberKey);
    }
  }

  await RemoveMemberfromGroup(groupKey, auth.currentUser.uid, true);

  await remove(ref(database, `/groups/${groupKey}`));
  await remove(
    ref(database, `/users/${auth.currentUser.uid}/groups/${groupKey}`)
  );
};

const RemoveGroupFromUser = async (groupKey) => {
  await remove(
    ref(database, `/users/${auth.currentUser.uid}/groups/${groupKey}`)
  );
};

const CreateKey = async (string) => await xxhash128(string);

const CreateCode = async (code) => {
  const codeKey = await CreateKey(code.val);
  code.owner = auth.currentUser.uid;
  const updates = {};
  updates[`/users/${auth.currentUser.uid}/codes/${codeKey}`] = true;
  updates[`/codes/${codeKey}`] = code;
  // updates[`/codes/${codeKey}/owner`] = auth.currentUser.uid;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const UpdateCode = async (codeKey, codeIn) => {
  const codeRef = ref(database, `/codes/${codeKey}`);

  const returnVal = await runTransaction(codeRef, (code) => {
    code.name = codeIn.name;
    code.usesPerDay = codeIn.usesPerDay;
    code.writable.usesLeft = codeIn.writable.usesLeft;
    return code;
  });

  return returnVal.val;
};

const ResetCodeForToday = async (codeKey, timeVal, usesPerDay) => {
  const updates = {};
  updates[`/codes/${codeKey}/writable/lastUsed`] = timeVal;
  updates[`/codes/${codeKey}/writable/usesLeft`] = usesPerDay;
  updates[`/codes/${codeKey}/writable/reservations`] = null;
  //need to iterate and remove reservations for that code from /reservations
  updates[`/reservations`] = null;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const DeleteCode = async (codeKey) => {
  const groups = await get(child(ref(database), `/codes/${codeKey}/groups`));

  groups.forEach(async (group) => {
    await RemoveCodeFromGroup(codeKey, group.key);
  });

  await remove(ref(database, `/codes/${codeKey}`));
  await remove(
    ref(database, `/users/${auth.currentUser.uid}/codes/${codeKey}`)
  );
};

//remove group from code if user can't access the group
const CleanCode = async (codeKey) => {
  const groups = (
    await get(child(ref(database), `/codes/${codeKey}/groups`))
  ).val();
  if (!groups) {
    return;
  }
  for (const [group] of Object.entries(groups)) {
    //console.log(group);
    try {
      await get(child(ref(database), `/groups/${group}`));
    } catch (err) {
      await RemoveGroupFromCode(codeKey, group);
    }
  }
};

const AddCodeToGroup = async (codeKey, groupKey) => {
  const updates = {};
  updates[`/codes/${codeKey}/groups/${groupKey}`] = true;
  updates[`/groups/${groupKey}/codes/${codeKey}`] = auth.currentUser.uid;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const RemoveCodeFromGroup = async (codeKey, groupKey) => {
  const updates = {};
  updates[`/groups/${groupKey}/codes/${codeKey}`] = null;
  const updateVal = await update(ref(database), updates);
  //console.log("codeKey", codeKey);
  //console.log("groupKey", groupKey);
  const reservations = (
    await get(child(ref(database), `/codes/${codeKey}/writable/reservations`))
  ).val();

  if (!reservations) {
    return;
  }

  for (const [reservationTime, reservation] of Object.entries(reservations)) {
    if (reservation.groupKey === groupKey) {
      //console.log("reservations used", reservation.used);
      if (reservation.used === false) {
        await RemoveReservationFromGroupAndIncrementUsesLeft(
          codeKey,
          reservationTime
        );
        await SetReservationError(
          reservation.reservationKey,
          "Code removed from group"
        );
      } else if (reservation.used === true) {
        await RemoveReservationFromGroup(codeKey, reservationTime);
      }
    }
  }

  return updateVal;
};

const RemoveGroupFromCode = async (codeKey, groupKey) => {
  const updates = {};
  updates[`/codes/${codeKey}/groups/${groupKey}`] = null;
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

const DeleteAllInvites = async (groupKey) => {
  const updates = {};
  const invites = (
    await get(child(ref(database), `/groups/${groupKey}/invites/`))
  ).val();

  if (!!invites) {
    for (const [invite] of Object.entries(invites)) {
      updates[`/invites/${invite}`] = null;
    }
  }
  updates[`/groups/${groupKey}/invites/`] = null;

  await update(ref(database), updates);
};

const AddUserToGroup = async (joinCode) => {
  const groupKey = (
    await get(child(ref(database), `/invites/${joinCode}`))
  ).val();

  //Return if groupKey isn't valid
  if (!groupKey) {
    return;
  }

  //Check if already part of group
  const alreadyJoined = (
    await get(
      child(ref(database), `/users/${auth.currentUser.uid}/groups/${groupKey}`)
    )
  ).exists();
  if (!alreadyJoined) {
    let updates = {};
    updates[`/users/${auth.currentUser.uid}/groups/${groupKey}`] = false;
    updates[`/groups/${groupKey}/members/${auth.currentUser.uid}`] = false;
    updates[`/groups/${groupKey}/invites/${joinCode}`] = null;
    updates[`/invites/${joinCode}`] = null;
    const updateVal = await update(ref(database), updates);
    return updateVal;
  }
};

const UpdateUserName = async (userName) => {
  const updates = {};
  updates[`/users/${auth.currentUser.uid}/username`] = userName;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const UpdateEmail = async (email) => {
  const updates = {};
  updates[`/users/${auth.currentUser.uid}/email`] = email;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const GetCurrentTime = async () => {
  const updates = {};
  updates[`/users/${auth.currentUser.uid}/timestamp`] = serverTimestamp();
  await update(ref(database), updates);
  const returnTimestamp = await get(
    child(ref(database), `/users/${auth.currentUser.uid}/timestamp`)
  );

  return returnTimestamp.val();
};

const RemoveReservation = async (codeKey, reservationTime, reservationKey) => {
  const updates = {};
  updates[`/codes/${codeKey}/writable/reservations/${reservationTime}`] = null;
  updates[`/reservations/${reservationKey}`] = null;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const RemoveReservationAndIncrementUsesLeft = async (
  codeKey,
  reservationTime,
  reservationKey
) => {
  const codeRef = ref(database, `/codes/${codeKey}/writable`);
  const updates = {};
  const returnVal = await runTransaction(codeRef, (code) => {
    if (code) {
      if (!!code?.reservations && !!code?.reservations[reservationTime]) {
        code.usesLeft++;
        code.reservations[reservationTime] = null;
      } else {
        return undefined; // abort the transaction
      }
    }
    return code;
  });
  if (!returnVal.committed) {
    return returnVal.committed;
  }
  updates[`/reservations/${reservationKey}`] = null;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const RemoveReservationFromGroup = async (codeKey, reservationTime) => {
  const updates = {};
  updates[`/codes/${codeKey}/writable/reservations/${reservationTime}`] = null;

  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const RemoveReservationFromGroupAndIncrementUsesLeft = async (
  codeKey,
  reservationTime
) => {
  //console.log(codeKey);
  //console.log("in RemoveReservationFromGroupAndIncrementUsesLeft");
  const codeRef = ref(database, `/codes/${codeKey}/writable`);

  const returnVal = await runTransaction(codeRef, (code) => {
    if (code) {
      if (!!code?.reservations && !!code?.reservations[reservationTime]) {
        code.usesLeft++;
        code.reservations[reservationTime] = null;
      } else {
        return undefined; // abort the transaction
      }
    }
    return code;
  });
  if (!returnVal.committed) {
    return returnVal.committed;
  }
};

const RemoveExpiredReservation = async (
  codeKey,
  reservationTime,
  reservationKey
) => {
  const updates = {};
  updates[`/codes/${codeKey}/writable/reservations/${reservationTime}`] = null;
  updates[`/reservations/${reservationKey}/expired`] = true;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const RemoveExpiredReservationAndIncrementUsesLeft = async (
  codeKey,
  reservationTime,
  reservationKey
) => {
  const codeRef = ref(database, `/codes/${codeKey}/writable`);
  const updates = {};
  const returnVal = await runTransaction(codeRef, (code) => {
    if (code) {
      if (!!code?.reservations && !!code?.reservations[reservationTime]) {
        code.usesLeft++;
        code.reservations[reservationTime] = null;
      } else {
        return undefined; // abort the transaction
      }
    }
    return code;
  });
  if (!returnVal.committed) {
    return returnVal.committed;
  }
  updates[`/reservations/${reservationKey}/expired`] = true;
  const updateVal = await update(ref(database), updates);
  return updateVal;
};

const BookCode = async (codeKey, reservationTime, groupKey) => {
  const codeRef = ref(database, `/codes/${codeKey}/writable`);
  const reservationKey = push(child(ref(database), "reservations")).key;
  const updates = {};
  const returnVal = await runTransaction(codeRef, (code) => {
    //console.log(code);
    if (code) {
      if (code.usesLeft < 1) {
        return undefined;
      }
      if (!code.reservations) {
        code.reservations = {};
      }
      code.reservations[reservationTime] = {
        user: auth.currentUser.uid,
        used: false,
        reservationKey: reservationKey,
        groupKey: groupKey,
      };

      code.usesLeft--;
    }
    return code;
  });
  //console.log("returnVal", returnVal);
  if (!returnVal.committed) {
    return returnVal.committed;
  }
  updates[`/reservations/${reservationKey}`] = {
    userKey: auth.currentUser.uid,
    codeKey: codeKey,
    reservationTime: reservationTime,
    groupKey: groupKey,
    message: "Loading",
    error: false,
    expired: false,
  };
  updates[`users/${auth.currentUser.uid}/reservations/${reservationKey}`] =
    reservationTime;
  await update(ref(database), updates);

  return true;
};

const GetReservationObject = async (reservationKey) => {
  const reservation = await get(
    child(ref(database), `/reservations/${reservationKey}`)
  );
  return reservation.val();
};

const RemoveReservationFromUser = async (reservationKey) => {
  const updates = {};
  updates[`/users/${auth.currentUser.uid}/reservations/${reservationKey}`] =
    null;
  updates[`/reservations/${reservationKey}`] = null;
  await update(ref(database), updates);
};

const IncrementStrikes = async (codeKey, code, groupKey, group) => {
  const messageKey = push(child(ref(database), `/messages/${code?.owner}`)).key;
  const updates = {};
  updates[`/codes/${codeKey}/writable/strikes`] = increment(1);
  if (code?.writable?.strikes > 0) {
    //remove code from group and set reservations to error
    updates[`/groups/${groupKey}/codes/${codeKey}`] = null;
    //console.log(code?.writable?.reservations);
    for (const [, reservation] of Object.entries(
      code?.writable?.reservations
    )) {
      updates[`/reservations/${reservation.reservationKey}/error`] = true;
      updates[`/reservations/${reservation.reservationKey}/message`] =
        "Code removed due to too many strikes";
    }

    //send message to owner
    updates[
      `/messages/${code?.owner}/${messageKey}`
    ] = `Your code called ${code?.name} has been removed from ${group?.name} for having too many strikes.`;
  } else {
    //send different message to owner
    updates[
      `/messages/${code?.owner}/${messageKey}`
    ] = `Your code called ${code?.name} has gotten a strike from ${group?.name} for not working, one more and it will be removed.`;
  }

  await update(ref(database), updates);
};

const ResetStrikes = async (codeKey) => {
  const updates = {};
  updates[`/codes/${codeKey}/writable/strikes`] = 0;
  await update(ref(database), updates);
};

const SetReservationError = async (reservationKey, errorMessage) => {
  const updates = {};
  updates[`/reservations/${reservationKey}/error`] = true;
  updates[`/reservations/${reservationKey}/message`] = errorMessage;
  await update(ref(database), updates);
};

const SetReservationUsed = async (codeKey, reservationTime) => {
  const updates = {};
  updates[
    `/codes/${codeKey}/writable/reservations/${reservationTime}/used`
  ] = true;
  await update(ref(database), updates);
};
///////////////// check this function
const RemoveMemberfromGroup = async (groupKey, memberKey, force) => {
  //if user is the only admin, throw an error and ask the user to appoint an admin before leaving

  //get members, filtering for admins
  const adminQuery = query(
    ref(database, `groups/${groupKey}/members`),
    orderByValue(),
    equalTo(true)
  );
  const admins = (await get(adminQuery)).val();
  const adminKeys = Object.keys(admins);

  const memberQuery = query(ref(database, `groups/${groupKey}/members`));
  const memberKeys = (await get(memberQuery)).val();

  if (
    memberKeys.length > 1 &&
    adminKeys.length === 1 &&
    adminKeys[0] === memberKey &&
    !force
  ) {
    throw new Error("You can't leave with appointing another admin, sorry");
  }

  // get codes owned by user
  //console.log("member key", memberKey);
  const memberCodesQuery = query(
    ref(database, `/codes`),
    orderByChild("owner"),
    equalTo(memberKey)
  );
  const memberCodes = (await get(memberCodesQuery)).val();

  //console.log("get codes in group");
  //get codes in group
  const groupCodesQuery = query(ref(database, `/groups/${groupKey}/codes`));
  const groupCodes = (await get(groupCodesQuery)).val();

  if (!!groupCodes) {
    if (!!memberCodes) {
      //separate codes owned by user and codes not owned by user in group
      //console.log("separate codes owned by user and not owned by user");
      const codesOwnedByUser = [];
      const codesNotOwnedByUser = [];
      for (const [codeKey] of Object.entries(groupCodes)) {
        if (memberCodes[codeKey] !== undefined) {
          codesOwnedByUser.push(codeKey);
        } else {
          codesNotOwnedByUser.push(codeKey);
        }
      }

      //console.log("remove codes owned by user from the group");
      //remove codes owned by user from the group
      for (const codeKey of codesOwnedByUser) {
        await RemoveCodeFromGroup(codeKey, groupKey);
      }
    }

    const groupName = (
      await get(child(ref(database), `/groups/${groupKey}/name`))
    ).val();
    //console.log("remove reservations for the user in the codes for the group");
    // remove reservations for the user in the codes for the group
    for (const [codeKey] of Object.entries(groupCodes)) {
      const code = (await get(child(ref(database), `/codes/${codeKey}`))).val();
      if (!!code?.writable?.reservations) {
        for (const [reservationTime, reservation] of Object.entries(
          code.writable.reservations
        )) {
          if (
            reservation.groupKey === groupKey &&
            reservation.user === memberKey
          ) {
            if (reservation.used === false) {
              await RemoveReservationFromGroupAndIncrementUsesLeft(
                codeKey,
                reservationTime
              );
              await SetReservationError(
                reservation.reservationKey,
                `You were removed from ${groupName}`
              );
            } else if (reservation.used === true) {
              await RemoveReservationFromGroup(codeKey, reservationTime);
            }
          }
        }
      }
    }
  }
  if (!force) {
    //console.log("remove user from group");
    //remove user from the group
    const updates = {};
    updates[`/groups/${groupKey}/members/${memberKey}`] = null;
    await update(ref(database), updates);
  }
};

const LeaveGroup = async (groupKey, memberKey) => {
  const memberQuery = query(ref(database, `groups/${groupKey}/members`));
  const memberKeys = (await get(memberQuery)).val();

  if (memberKeys.length === 1) {
    await DeleteGroup(groupKey);
  } else {
    await RemoveMemberfromGroup(groupKey, memberKey);
  }
};

const HandleMemberNotInGroup = async (groupKey) => {
  const member = await get(
    child(ref(database), `/groups/${groupKey}/members/${auth.currentUser.uid}`)
  );
  //console.log(member.val());
  if (member.val() === null) {
    await RemoveGroupFromUser(groupKey);
  }
};

const MakeAdmin = async (groupKey, memberKey) => {
  const updates = {};
  updates[`/groups/${groupKey}/members/${memberKey}`] = true;
  await update(ref(database), updates);
};

const UnMakeAdmin = async (groupKey, memberKey) => {
  //get members, filtering for admins
  const adminQuery = query(
    ref(database, `groups/${groupKey}/members`),
    orderByValue(),
    equalTo(true)
  );
  const admins = (await get(adminQuery)).val();
  const adminKeys = Object.keys(admins);

  if (adminKeys.length === 1 && adminKeys[0] === memberKey) {
    throw new Error("You can't remove all admins");
  }

  const updates = {};
  updates[`/groups/${groupKey}/members/${memberKey}`] = false;
  await update(ref(database), updates);
};

const AlignUserAdminSettings = async (groupKey, adminGroup) => {
  const adminUser = (
    await get(
      ref(database, `/users/${auth.currentUser.uid}/groups/${groupKey}`)
    )
  ).val();
  if (adminGroup && !adminUser) {
    await set(
      ref(database, `/users/${auth.currentUser.uid}/groups/${groupKey}`),
      true
    );
  } else if (!adminGroup && adminUser) {
    await set(
      ref(database, `/users/${auth.currentUser.uid}/groups/${groupKey}`),
      false
    );
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
  query,
  onChildAdded,
  DeleteGroup,
  GetGroupAdmin,
  CreateCode,
  ResetCodeForToday,
  UpdateCode,
  DeleteCode,
  CleanCode,
  GetCodeName,
  GetCodeAdmin,
  AddCodeToGroup,
  RemoveCodeFromGroup,
  RemoveGroupFromCode,
  CreateInviteCode,
  DeleteInviteCode,
  AddUserToGroup,
  UpdateUserName,
  UpdateEmail,
  GetCurrentTime,
  GetGroupReserveTime,
  GetGroupMinutesBetweenUses,
  RemoveReservation,
  RemoveReservationAndIncrementUsesLeft,
  RemoveExpiredReservation,
  RemoveExpiredReservationAndIncrementUsesLeft,
  BookCode,
  GetReservationObject,
  RemoveReservationFromUser,
  IncrementStrikes,
  ResetStrikes,
  SetReservationError,
  SetReservationUsed,
  RemoveMemberfromGroup,
  RemoveGroupFromUser,
  HandleMemberNotInGroup,
  MakeAdmin,
  UnMakeAdmin,
  AlignUserAdminSettings,
  LeaveGroup,
};
