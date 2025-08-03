import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("Environment variable NEXT_PUBLIC_BE_URL is not defined");
}


export default axios.create({
  baseURL: BASE_URL,
});

