import ReactDom from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./router";
import { ToastContainer } from "react-toastify";
import "antd/dist/reset.css"; // Reset CSS for Ant Design
import "antd/dist/antd.min.js"; // JS for Ant Design
import "./index.css"; // Custom CSS

// เปลี่ยนเวลาให้เป็นภาษาไทย
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";

dayjs.extend(relativeTime);
dayjs.locale("th");

const queryClient = new QueryClient();

ReactDom.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <ToastContainer position="top-right" autoClose={3000} />
    <AppRouter />
  </QueryClientProvider>
);
