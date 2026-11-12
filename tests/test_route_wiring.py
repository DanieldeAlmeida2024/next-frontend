import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
def get(path):
    return (ROOT / path).read_text(encoding="utf-8")

class RouteWiringTests(unittest.TestCase):
    def test_no_duplicate_action_implementation(self):
        self.assertTrue((ROOT / "src/app/driver/start-route.action.ts").is_file())
        self.assertFalse((ROOT / "src/app/driver/start-route.action.tsx").exists())

    def test_start_validates_route_before_network_side_effect(self):
        action=get("src/app/driver/start-route.action.ts")
        self.assertLess(action.index("parseRouteId(formData.get"), action.index("await fetch("))
        self.assertIn('method: "POST"',action)
        self.assertIn('redirect: "error"',action)
        self.assertIn('cache: "no-store"',action)
        self.assertNotIn("console.error(await response.text())",action)

    def test_creation_validates_both_places_and_directions(self):
        action=get("src/app/new-route/create-route.action.ts")
        self.assertLess(action.index('parsePlaceId(formData.get("sourceId"))'),action.index("await fetch("))
        self.assertLess(action.index("parseDirections(await directionsResponse.json())"),action.index("method: \"POST\""))
        self.assertIn("sourceId === destinationId",action)
        self.assertNotIn("console.error(await response.text())",action)

    def test_get_route_no_shared_cache_and_explicit_statuses(self):
        route=get("src/app/api/routes/[routeId]/route.ts")
        self.assertLess(route.index("parseRouteId("),route.index("await fetch("))
        self.assertIn('cache: "no-store"',route)
        for code in ["400","404","502","503"]:
            self.assertIn("status: "+code,route)

    def test_search_params_are_encoded_not_concatenated(self):
        page=get("src/app/new-route/page.tsx")
        self.assertIn('sourceUrl.searchParams.set("text", sourceTerm)',page)
        self.assertIn('destinationUrl.searchParams.set("text", destinationTerm)',page)
        self.assertNotIn('/places?text=${source}',page)
        self.assertNotIn("console.log(source, destination)",page)

if __name__ == "__main__":
    unittest.main()
