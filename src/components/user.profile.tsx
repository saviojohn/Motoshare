const UserInformation: React.FC<{ userInfo: UserInfo }> = ({ userInfo }) => {
    return (
        <div className="bg-gray-100 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">User Information</h2>
            <div className="grid grid-cols-2 gap-4">
                {userInfo.name && (
                    <div>
                        <p className="text-gray-500">Name:</p>
                        <p>{userInfo.name}</p>
                    </div>
                )}
                {userInfo.gender && (
                    <div>
                        <p className="text-gray-500">Gender:</p>
                        <p>{userInfo.gender}</p>
                    </div>
                )}
                {userInfo.email && (
                    <div>
                        <p className="text-gray-500">Email:</p>
                        <p>{userInfo.email}</p>
                    </div>
                )}
                {userInfo.phone && (
                    <div>
                        <p className="text-gray-500">Phone:</p>
                        <p>{userInfo.phone}</p>
                    </div>
                )}
                {userInfo.address && (
                    <div>
                        <p className="text-gray-500">Address:</p>
                        <p>{userInfo.address}</p>
                    </div>
                )}
                {userInfo.aadharNumber && (
                    <div>
                        <p className="text-gray-500">Aadhar Number:</p>
                        <p>{userInfo.aadharNumber}</p>
                    </div>
                )}
                {userInfo.bikeModel && (
                    <div>
                        <p className="text-gray-500">Bike Model:</p>
                        <p>{userInfo.bikeModel}</p>
                    </div>
                )}
                {userInfo.vehicleNumber && (
                    <div>
                        <p className="text-gray-500">Vehicle Number:</p>
                        <p>{userInfo.vehicleNumber}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserInformation;