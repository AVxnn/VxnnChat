import React, {useState, useEffect} from 'react';
import {collection, onSnapshot, query} from "firebase/firestore";
import {db} from "../../api/firebase";

const UsersSnap = () => {

  const [users, setUsers] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "users")), (querySnapshot) => {
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users)
      console.log(users)
    });
    return () => unsub()
  }, [])

  return users
};

export default UsersSnap;
