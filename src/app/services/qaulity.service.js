import httpService from "./http.service";
const qualityEndpoint = "quality/";

const qualityService = {
    fetchAll: async () => {
      try {
        const { data } = await httpService.get(qualityEndpoint);
        return data;
    } catch (err) {
            console.log("ERROR", err);
            throw err;
        }
    }
};
export default qualityService;
