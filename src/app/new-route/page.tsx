import { MapNewRoute } from "./MapNewRoute";
import { NewRouteForm } from "./NewRouteForm";
import { nestApiUrl, parsePlaceId, parseSearchTerm, parseDirections } from "../../utils/route-input";

export async function searchDirections(source: string, destination: string) {
  const sourceTerm = parseSearchTerm(source);
  const destinationTerm = parseSearchTerm(destination);
  if (!sourceTerm || !destinationTerm) {
    throw new Error("Origem e destino devem conter texto válido com até 120 caracteres.");
  }

  const sourceUrl = nestApiUrl(process.env.NEST_API_URL, "/places");
  const destinationUrl = nestApiUrl(process.env.NEST_API_URL, "/places");
  sourceUrl.searchParams.set("text", sourceTerm);
  destinationUrl.searchParams.set("text", destinationTerm);

  const [sourceResponse, destinationResponse] = await Promise.all([
    fetch(sourceUrl.toString(), { cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10_000) }),
    fetch(destinationUrl.toString(), { cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10_000) }),
  ]);

  if (!sourceResponse.ok || !destinationResponse.ok) {
    throw new Error("Não foi possível consultar origem e destino.");
  }

  const [sourceData, destinationData] = await Promise.all([
    sourceResponse.json(),
    destinationResponse.json(),
  ]);
  const placeSourceId = parsePlaceId(sourceData?.candidates?.[0]?.place_id);
  const placeDestinationId = parsePlaceId(destinationData?.candidates?.[0]?.place_id);
  if (!placeSourceId || !placeDestinationId) {
    throw new Error("Nenhum local válido foi encontrado.");
  }

  const directionsUrl = nestApiUrl(process.env.NEST_API_URL, "/directions");
  directionsUrl.searchParams.set("originId", placeSourceId);
  directionsUrl.searchParams.set("destinationId", placeDestinationId);

  const directionsResponse = await fetch(directionsUrl.toString(), {
    cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10_000),
  });
  if (!directionsResponse.ok) throw new Error("Não foi possível consultar o trajeto.");
  const directionsData = await directionsResponse.json();
  if (!parseDirections(directionsData)) throw new Error("Trajeto incompleto no serviço de mapas.");

  return { directionsData, placeSourceId, placeDestinationId };
}

export async function NewRoutePage({
  searchParams,
}: {
  searchParams: Promise<{ source: string; destination: string }>;
}) {
  const { source, destination } = await searchParams;

  const result =
    source && destination ? await searchDirections(source, destination) : null;
  let directionsData = null;
  let placeSourceId = null;
  let placeDestinationId = null;

  if (result) {
    directionsData = result.directionsData;
    placeSourceId = result.placeSourceId;
    placeDestinationId = result.placeDestinationId;
  }

  return (
    <div className="flex flex-1 w-full h-full">
      <div className="w-1/3 p-4 h-full">
        <h4 className="text-3xl text-contrast mb-2">Nova rota</h4>
        <form className="flex flex-col space-y-4" method="get">
          <div className="relative">
            <input
              id="source"
              name="source"
              type="search"
              placeholder=""
              defaultValue={source}
              className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-contrast bg-default border-0 border-b-2 border-contrast appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
            />
            <label
              htmlFor="source"
              className="absolute text-contrast duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] start-2.5 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Origem
            </label>
          </div>
          <div className="relative">
            <input
              id="destination"
              name="destination"
              type="search"
              placeholder=""
              defaultValue={destination}
              className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-contrast bg-default border-0 border-b-2 border-contrast appearance-none focus:outline-none focus:ring-0 focus:border-primary peer"
            />
            <label
              htmlFor="destination"
              className="absolute text-contrast duration-300 transform -translate-y-4 scale-75 top-3 z-10 origin-[0] start-2.5 peer-focus:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Destino
            </label>
          </div>
          <button
            type="submit"
            className="bg-main text-primary p-2 rounded text-xl font-bold"
          >
            Pesquisar
          </button>
        </form>
        {directionsData && (
          <div className="mt-4 p-4 border rounded text-contrast">
            <ul>
              <li className="mb-2">
                <strong>Origem:</strong>{" "}
                {directionsData.routes[0].legs[0].start_address}
              </li>
              <li className="mb-2">
                <strong>Destino:</strong>{" "}
                {directionsData.routes[0].legs[0].end_address}
              </li>
              <li className="mb-2">
                <strong>Distância:</strong>{" "}
                {directionsData.routes[0].legs[0].distance.text}
              </li>
              <li className="mb-2">
                <strong>Duração:</strong>{" "}
                {directionsData.routes[0].legs[0].duration.text}
              </li>
            </ul>
            <NewRouteForm>
              {placeSourceId && (
                <input
                  type="hidden"
                  name="sourceId"
                  defaultValue={placeSourceId}
                />
              )}
              {placeDestinationId && (
                <input
                  type="hidden"
                  name="destinationId"
                  defaultValue={placeDestinationId}
                />
              )}
              <button
                type="submit"
                className="bg-main text-primary font-bold p-2 rounded mt-4"
              >
                Adicionar rota
              </button>
            </NewRouteForm>
          </div>
        )}
      </div>
      <MapNewRoute directionsData={directionsData} />
    </div>
  );
}

export default NewRoutePage;
