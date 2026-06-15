import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/CookieBanner";
import { CustomCursor } from "@/components/CustomCursor";
import { SplashScreen } from "@/components/SplashScreen";
import { Analytics } from "@vercel/analytics/react";
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
import AdminPanel from "@/pages/AdminPanel";

const queryClient = new QueryClient();

import { useEffect } from "react";

function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation(to);
  }, [to, setLocation]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/initiatives" component={StoriesPage} />
      <Route path="/initiatives/:slug" component={StoryDetail} />
      
      {/* Legacy redirects */}
      <Route path="/stories">
        <Redirect to="/initiatives" />
      </Route>
      <Route path="/stories/:slug">
        {(params) => <Redirect to={`/initiatives/${params.slug}`} />}
      </Route>

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
        <SplashScreen />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
          <CookieBanner />
          <Analytics />
        </WouterRouter>
        <Toaster />
        <SonnerToaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
