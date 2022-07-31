import axios from "axios";

export const fetchLists = async (search = "", page = 0) => {
  const { data } = await axios.get(
    `http://localhost:3001/lists?name_like=${search}&_limit=50&_page=${page}`
  );
  return data;
};
