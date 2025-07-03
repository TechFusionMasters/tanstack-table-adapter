import type { Preview } from "@storybook/react-vite";
import "../stories/tailwind.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "TableAdapter",
          [
            "Basic",
            "Pagination",
            "Sorting",
            "Selection",
            "Loading States",
            "Server Side",
            "Advanced",
            "Filtering",
          ],
        ],
      },
    },
  },
};

export default preview;
