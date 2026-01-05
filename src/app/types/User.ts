export interface Profile {
    first_name: string;
    last_name: string;
    avatar_url: string;
}

export interface User {

    _id: string;

    username: string;

    email: string;

    created_at: string;

    is_admin: boolean;

    is_student: boolean;

    group: string;

    profile: Profile;

    recommended_vkms: string[];

}



export type PartialUserWithPartialProfile = Omit<Partial<User>, 'profile'> & { profile?: Partial<Profile> };
