import { createFileRoute } from "@tanstack/react-router";
import App from "../App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Little Meal — Complementary feeding for babies" },
      {
        name: "description",
        content:
          "Track your baby's complementary feeding journey: foods tried, reactions, shopping list and recipes for BLW, BLISS and purées.",
      },
      { property: "og:title", content: "Little Meal — Complementary feeding for babies" },
      {
        property: "og:description",
        content:
          "Track your baby's complementary feeding journey: foods tried, reactions, shopping list and recipes for BLW, BLISS and purées.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <App />;
}
