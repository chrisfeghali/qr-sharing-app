import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  GetCurrentTime,
  GetGroupAdmin,
  UpdateGroupName,
  UpdateReservationTime,
  ResetCodeForToday,
  RemoveExpiredReservation,
  RemoveExpiredReservationAndIncrementUsesLeft,
  RemoveCodeFromGroup,
  HandleMemberNotInGroup,
} from "../apis/firebase";
import { database, ref } from "../apis/firebase";
import { useLocation } from "react-router-dom";
import { useObjectVal } from "react-firebase-hooks/database";
import { useAuth } from "./AuthContext";

const GroupContext = React.createContext();

export function useGroup() {
  return useContext(GroupContext);
}

export function GroupProvider({ children, ...props }) {
  const [resolutionTime] = useState(5);
  const [lookaheadHours] = useState(6);
  const { currentUser } = useAuth();

  const location = useLocation();

  const [groupValue, setGroupValue] = useState(
    location.pathname.split("/").reverse()[1]
  );

  const [minutesBetweenUses] = useObjectVal(
    ref(database, `groups/${groupValue}/minutesBetweenUses`)
  );

  const [reserveTime] = useObjectVal(
    ref(database, `groups/${groupValue}/reserveTime`)
  );

  const [groupName] = useObjectVal(ref(database, `groups/${groupValue}/name`));

  const [admin, setAdmin] = useState();
  const [adminWatcher] = useObjectVal(
    ref(database, `groups/${groupValue}/members/${currentUser.uid}`)
  );

  useEffect(() => {
    if (adminWatcher === true || adminWatcher === false) {
      setAdmin(adminWatcher);
    }
  }, [adminWatcher]);

  const [members] = useState();

  const [loading, setLoading] = useState(true);

  const [codes, setCodes] = useState(new Map());
  const updateCodes = useCallback((key, value) => {
    setCodes((prevData) => {
      //console.log(`Previous Data:`);
      if (!!prevData)
        if (!!value) {
          //console.log(prevData);
          //console.log(key);
          const newData = new Map(prevData.set(key, value));

          //console.log(`New Data:`);
          //console.log(newData);
          return newData;
        } else {
          const newData = new Map(prevData);
          newData.delete(key);
          //console.log(`New Data:`);
          //console.log(newData);
          return newData;
        }
    });
  }, []);

  const preprocessCode = useCallback(
    async (key, value) => {
      //console.log("value", value);
      let returnVal = 0;
      //check if code needs to be reset for current day
      const currentTime = await GetCurrentTime();
      //console.log(currentTime);
      const currentDate = new Date(currentTime);
      //console.log(currentDate);
      //console.log(value);
      //console.log(value.writable.lastUsed);
      const lastUsedDate = new Date(value.writable.lastUsed);

      //console.log(currentDate.toDateString(), lastUsedDate.toDateString());
      if (currentDate.toDateString() !== lastUsedDate.toDateString()) {
        //console.log("reset code");
        ResetCodeForToday(key, currentTime, value.usesPerDay);
        returnVal = 1;
      }

      //check if old codes have been used
      if (!!value?.writable?.reservations) {
        Object.entries(value.writable.reservations).forEach(
          ([reservationTime, value]) => {
            //console.log(parseInt(reservationTime));
            let endReserveTime =
              parseInt(reservationTime) + reserveTime * 60 * 1000;
            let endFinishTime =
              parseInt(reservationTime) +
              (reserveTime + minutesBetweenUses) * 60 * 1000;
            //console.log(`endReserveTime: ${endReserveTime}`);
            //console.log(`currentTime: ${currentTime}`);
            //check if code has been used
            if (currentTime > endReserveTime) {
              // //console.log(
              //   "currentTime greater than the end of the reserved time"
              // );
              if (value.used === false) {
                //remove reservation and increment uses
                RemoveExpiredReservationAndIncrementUsesLeft(
                  key,
                  reservationTime,
                  value.reservationKey
                );
                returnVal = 1;
              } else {
                if (currentTime > endFinishTime) {
                  RemoveExpiredReservation(
                    key,
                    reservationTime,
                    value.reservationKey
                  );
                  returnVal = 1;
                }
              }
            }
          }
        );
      }

      if (value?.writable?.strikes > 1) {
        RemoveCodeFromGroup(key, groupValue);
        returnVal = 1;
      }

      return returnVal;
    },
    [groupValue, minutesBetweenUses, reserveTime]
  );

  const encodeTime = useCallback(
    (time) => {
      const timeMinutes = time.getMinutes() + time.getHours() * 60;
      const timeBit = timeMinutes / resolutionTime;
      const timeEncoded = BigInt(1) << BigInt(timeBit);
      // //console.log("timeEncoded", timeEncoded.toString(2));
      return timeEncoded;
    },
    [resolutionTime]
  );

  const encodeInterval = useCallback(
    (startDate, endDate, reserveTime) => {
      const startMinutes = startDate.getMinutes() + startDate.getHours() * 60;
      const endMinutes = endDate.getMinutes() + endDate.getHours() * 60;
      const startMinuteBit = startMinutes / resolutionTime;
      const endMinuteBit = endMinutes / resolutionTime;
      let encodedInterval =
        ((BigInt(1) << BigInt(endMinuteBit - startMinuteBit)) - 1n) <<
        BigInt(startMinuteBit);

      return (encodedInterval & reserveTime) >> BigInt(startMinuteBit);
    },
    [resolutionTime]
  );

  //function to encode the reservation time into a binary little endian BigInt indicating when the code is used(1) or free(0)
  const encodeReservations = useCallback(
    (value) => {
      //determine the number of bits depending on the resolution
      const bits = (24 * 60) / resolutionTime; //+ 1;
      //console.log("bits", bits);
      let reservationBits = BigInt(0);
      let ones = null;

      //no uses left, set as all ones
      if (value?.writable?.usesLeft === 0) {
        ones = (BigInt(1) << BigInt(bits)) - 1n;
        return ones;
      }

      if (!value?.writable?.reservations) {
        //console.log("no reserations!");
        return reservationBits;
      }

      //console.log("reservation found!");

      Object.entries(value.writable.reservations).forEach(([key]) => {
        let originalTime = parseInt(key);
        let offsetTime = (reserveTime + minutesBetweenUses) * 60 * 1000;
        let startTime = originalTime - offsetTime;
        let endTime = originalTime + offsetTime;

        let startDate = new Date(startTime);
        let endDate = new Date(endTime);

        let startMinutes = startDate.getMinutes() + startDate.getHours() * 60;
        let endMinutes = endDate.getMinutes() + endDate.getHours() * 60;

        if (startMinutes > endMinutes) {
          // overflow or underflow has occurred, fix it

          let originalDate = new Date(originalTime);

          //end time has overflowed
          if (endDate.getDay() !== originalDate.getDay()) {
            endMinutes = 24 * 60;
          }

          //start time has underflowed
          if (startDate.getDay() !== originalDate.getDay()) {
            startMinutes = 0;
          }
        }

        let startMinuteBit = startMinutes / resolutionTime;
        let endMinuteBit = endMinutes / resolutionTime;

        //console.log(`key: ${key}`);
        //console.log(`offsetTime: ${offsetTime}`);
        //console.log(`startTime: ${startTime}`);
        //console.log(`endTime: ${endTime}`);
        //console.log("test");
        //console.log("startMinutes", startMinutes, startMinuteBit); //1683658824
        //console.log("endMinutes", endMinutes, endMinuteBit); //1683661224
        //console.log(new Date(startTime)); //1683661224
        //console.log(new Date(key)); //1683661224
        //console.log(new Date(endTime));

        //create the interval when busy the code is busy
        ones =
          ((BigInt(1) << BigInt(endMinuteBit - startMinuteBit)) - 1n) <<
          BigInt(startMinuteBit);

        //console.log("ones", ones.toString(2));

        //console.log("reservation before or ", reservationBits.toString(2));
        reservationBits = reservationBits | ones;
        //console.log("reservation after or ", reservationBits.toString(2));
      });
      // //console.log("reservation");
      // //console.log(reservation);

      // //console.log(value.writable);

      return reservationBits;
    },
    [resolutionTime, reserveTime, minutesBetweenUses]
  );

  const updateGroupName = async (groupName) => {
    return await UpdateGroupName(groupValue, groupName);
  };

  const updateReservationTime = async (reservationTime) => {
    return await UpdateReservationTime(groupValue, reservationTime);
  };

  useEffect(() => {
    setGroupValue(location.pathname.split("/").reverse()[1]);
  }, [location]);

  useEffect(() => {
    const getValues = async (groupValue) => {
      try {
        await HandleMemberNotInGroup(groupValue);
        //console.log("reset context");
        setCodes(new Map());
        const adminResult = await GetGroupAdmin(groupValue);
        setAdmin(adminResult);
        setLoading(false);
      } catch (error) {
        //console.log(error);
      }
    };
    //console.log("groupContext useEffect triggered");
    //console.log("groupValue", groupValue);
    getValues(groupValue);
  }, [groupValue]);

  const value = {
    groupName,
    // setGroupName,
    groupValue,
    admin,
    members,
    codes,
    loading,
    updateGroupName,
    updateCodes,
    updateReservationTime,
    reserveTime,
    minutesBetweenUses,
    encodeReservations,
    encodeTime,
    encodeInterval,
    resolutionTime,
    lookaheadHours,
    preprocessCode,
  };

  return (
    <GroupContext.Provider value={value}>
      {!loading && (
        <div
          style={{
            position: "absolute",
            top: "30px",
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {groupName}
        </div>
      )}
      {!loading && children}
    </GroupContext.Provider>
  );
}
