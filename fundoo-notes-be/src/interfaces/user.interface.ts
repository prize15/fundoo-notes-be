// src/interfaces/user.interface.ts
export interface IUser {
  _id?: string; // Optional, as it will be generated by MongoDB
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  createdAt?: Date; // Optional, will be managed by timestamps
  updatedAt?: Date; // Optional, will be managed by timestamps
}
