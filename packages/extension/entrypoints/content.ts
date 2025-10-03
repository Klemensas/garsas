import { ContentOrchestrator } from "../src/content-orchestrator.js";

export default defineContentScript({
  matches: [
    "*://*.ra.co/*",
    "*://*.amsterdam-dance-event.nl/*/program/*/*/*",
    "*://*.instagram.com/p/*",
  ],
  main() {
    const orchestrator = new ContentOrchestrator();
    orchestrator.processPage();
  },
});
