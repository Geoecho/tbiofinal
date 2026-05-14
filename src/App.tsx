import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/CookieBanner";
import { CustomCursor } from "@/components/CustomCursor";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import Register from "@/pages/Register";
import ShareStory from "@/pages/ShareStory";
import TermsOfService from "@/pages/Terms";
import PrivacyPolicy from "@/pages/Privacy";
import StoriesPage from "@/pages/StoriesPage";
import StoryDetail from "@/pages/StoryDetail";
import BrandingPage from "@/pages/BrandingPage";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/stories" component={StoriesPage} />
      <Route path="/stories/:slug" component={StoryDetail} />
      <Route path="/branding" component={BrandingPage} />
      <Route path="/share-story" component={ShareStory} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/projects/:slug" component={ProjectDetail} />
      <Route path="/register/:slug" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
          <CookieBanner />
        </WouterRouter>
        <Toaster />
        <SonnerToaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
