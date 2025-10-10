import { useMutation } from "@tanstack/react-query";
import { createAuthenticatedApiClient } from "@/utils/apiClient";

type UserData = {
  clerkUserId: string;
  email: string;
  firstName: string;
  lastName?: string;
  fullName: string;
};

type SaveUserResponse = {
  success: boolean;
  userId: string;
  message?: string;
};

const saveUserToBackend = async (userData: UserData, token: string): Promise<SaveUserResponse> => {
  const apiClient = createAuthenticatedApiClient(token);
  const response = await apiClient.post<SaveUserResponse>("/users", userData);
  return response.data;
};

export const useSaveUserToBackend = () => {
  return useMutation({
    mutationFn: ({ userData, token }: { userData: UserData; token: string }) =>
      saveUserToBackend(userData, token),
    onSuccess: (data) => {
      console.log("User saved to backend successfully:", data);
    },
    onError: (error: any) => {
      console.error("Failed to save user to backend:", error);
    },
  });
};
