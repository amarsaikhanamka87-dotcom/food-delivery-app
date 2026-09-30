import { server } from "@/app/api/api";

export const Salads = () => {
  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await server.get("/food", {});
      } catch (err) {
        console.log("error", err);
      }
      getCategory();
    };
  }, []);

  return <div></div>;
};
