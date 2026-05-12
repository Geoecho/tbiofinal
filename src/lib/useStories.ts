import { addStory, type StorySubmission } from "@/lib/adminStore";
import { useQueryClient } from "@tanstack/react-query";

export type SubmitStoryBody = {
  data: Omit<StorySubmission, "id" | "submittedAt">;
};

export function useGetPublishedStories() {
  return { data: [], isLoading: false, refetch: () => {} };
}

export function useSubmitStoryApi() {
  const qc = useQueryClient();
  return {
    mutateAsync: async (body: SubmitStoryBody) => {
      const story: StorySubmission = {
        ...body.data,
        id: Math.random().toString(36).substr(2, 9),
        submittedAt: new Date().toISOString(),
      };
      addStory(story);
      void qc.invalidateQueries({ queryKey: ["getPublishedStories"] });
      return story;
    },
    isPending: false,
  };
}

export function useAdminStorySubmissions() {
  return { data: [], isLoading: false, refetch: () => {} };
}

export function useApproveSubmission() {
  const qc = useQueryClient();
  return {
    mutateAsync: async ({ id }: { id: number }) => {
      console.log("Approving", id);
    },
    isPending: false,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["getStorySubmissions"] });
      void qc.invalidateQueries({ queryKey: ["getPublishedStories"] });
    },
  };
}

export function useRejectSubmission() {
  const qc = useQueryClient();
  return {
    mutateAsync: async ({ id }: { id: number }) => {
      console.log("Rejecting", id);
    },
    isPending: false,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["getStorySubmissions"] });
    },
  };
}

export function useCreatePublishedStoryApi() {
  const qc = useQueryClient();
  return {
    mutateAsync: async (body: any) => {
      console.log("Creating", body);
    },
    isPending: false,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["getPublishedStories"] });
    },
  };
}

export function useDeletePublishedStoryApi() {
  const qc = useQueryClient();
  return {
    mutateAsync: async ({ id }: { id: number }) => {
      console.log("Deleting", id);
    },
    isPending: false,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["getPublishedStories"] });
    },
  };
}
