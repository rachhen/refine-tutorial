export interface ICategory {
  id: string;
  title: string;
}

export interface IPost {
  id: string;
  title: string;
  status: "published" | "draft" | "rejected";
  category: { id: string };
  createdAt: string;
}

export interface IUser {
  id: string;
  firstName: string;
  email: string;
  lastName: string;
  status: boolean;
  birthday: string;
  avatar: IUserAvatar[];
}

export interface IUserAvatar {
  name: string;
  percent: number;
  size: number;
  status: string;
  type: string;
  uid: string;
  url: string;
}
