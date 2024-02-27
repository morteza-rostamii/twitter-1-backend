
export type TUser = {
  id: string,
  username: string,
  email: string,
  avatar: string,
  createdAt: Date,
  updatedAt: Date,
};

export type TGetTweetPaginated = {
  page: number,
  limit: number,
};

