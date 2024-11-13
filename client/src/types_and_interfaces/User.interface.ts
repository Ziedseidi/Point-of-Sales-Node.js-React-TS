// types_and_interfaces/User.interface.ts
export interface User {
  _id: string;
  userName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  profileImage?: string; // Ajoutez ce champ pour l'image de profil
  role: { name: string } | null;
  isDisabled: boolean;
}
