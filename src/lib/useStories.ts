export type StorySubmission = {
  id: string;
  name: string;
  age?: string;
  title: string;
  format: "speak" | "show" | "write";
  storyText?: string;
  audioFileName?: string;
  imageCount?: number;
  submittedAt: string;
};

export type SubmitStoryBody = {
  data: Omit<StorySubmission, "id" | "submittedAt">;
};

export function useSubmitStoryApi() {
  return {
    mutateAsync: async (body: SubmitStoryBody) => {
      const story: StorySubmission = {
        ...body.data,
        id: Math.random().toString(36).substr(2, 9),
        submittedAt: new Date().toISOString(),
      };
      // Story saved locally (localStorage could be added later if needed)
      return story;
    },
    isPending: false,
  };
}
