// 封装api
import http from "@/libs/http";

export const testModel = (data) => {
  const api = {
    url: "model-face/age_gender_model-weights_manifest.json",
    mockUrl: "",
  };
  return http.get(api, data);
};
