import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'react-redux';
import { queryClient } from "./lib/queryClient";
import { store } from './store';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PulsePage from "@/pages/PulsePage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={PulsePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
