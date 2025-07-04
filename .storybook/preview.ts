import type { Preview } from "@storybook/react-vite";
import "../stories/tailwind.css";

const preview: Preview = {
  parameters: {
    docs: {
      source: {
        state: 'open',
        copyButton: true
      }
    },
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
          "In Progress",
          ["TableAdapter", ["Sorting"]],
          "TODO",
          ["TableAdapter", ["Filtering"]],
        ],
      },
    },
  },
};

export default preview;
