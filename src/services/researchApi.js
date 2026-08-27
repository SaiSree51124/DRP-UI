import apiClient from "./apiClient";

const unwrap = (response) => response.data?.data ?? response.data;

export const getModules = async () => unwrap(await apiClient.get("/modules"));

export const getCurrentUser = async () => unwrap(await apiClient.get("/users/me"));

export const getOnboardingStatus = async () =>
  unwrap(await apiClient.get("/users/me/onboarding-status"));

export const getResearchFocus = async () =>
  unwrap(await apiClient.get("/users/me/research-focus"));

export const completeOnboarding = async (payload) =>
  unwrap(await apiClient.post("/users/me/onboarding/complete", payload));

export const getTherapeuticAreas = async () =>
  unwrap(await apiClient.get("/therapeutic-areas"));

export const getDashboardSummary = async () =>
  unwrap(await apiClient.get("/dashboard/summary"));

export const getQuickActions = async () =>
  unwrap(await apiClient.get("/dashboard/quick-actions"));

const researchApi = {
  getModules,
  getCurrentUser,
  getOnboardingStatus,
  getResearchFocus,
  completeOnboarding,
  getTherapeuticAreas,
  getDashboardSummary,
  getQuickActions,
};

export default researchApi;