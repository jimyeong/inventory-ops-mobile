export interface User{
    display_name: string;
    email: string;
    email_verified: boolean;
    is_anonymous: boolean;
    metadata: {
        last_sign_in_time: number;
        creation_time: number;
    };
    phone_number: string | null;
    photo_url: string;
    provider_id: string;
    firebase_uid: string;
}