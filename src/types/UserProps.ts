export type UserProps = {
    id: string;
    username: string;
    password: string;
    phoneNumber: string;
    email: string;
    name?: string;
    description?: string;
    location?: string;
    website?: string;
    photoUrl?: string;
    headerUrl?: string;
    isPremium: boolean;
    role: 'CITIZEN' | 'MINISTRY_STAFF' | 'ADMIN' | 'SUPER_ADMIN';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    followers: UserProps[];
    following: UserProps[];
};

export type UserResponse = {
    success: boolean;
    user: UserProps;
};
