import UserInformation from "@/components/user.profile";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { useRouter } from "next/router";
import {useEffect, useState } from "react";


const Profile = () => {
    const [userInfo, updateUserInfo] = useState({});
    const router = useRouter();
    useEffect(() => {
        try {
            const db = getDatabase();
            const user = getAuth().currentUser;
            const entity = user.displayName == 'driver'? 'drivers': 'customers';
            const profile = ref(db, entity+'/' + user.uid);
            onValue(profile, (snapshot) => {
                const data = snapshot.val();
                updateUserInfo(data);
            });
        } catch (e) {
            router.push('/sign_in');
        }
    }, [])
  return (
    <div>
        <div className="container mx-auto">
            <UserInformation userInfo={userInfo} />
        </div>
    </div>
  );
};

export default Profile;
