import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import "resend";
//#region src/pages/api/suggest.ts
var suggest_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
var MAX_LENGTH = 500;
var POST = async ({ request }) => {
	let suggestion;
	try {
		suggestion = (await request.json())?.suggestion;
	} catch {
		return json({ error: "Expected a JSON body." }, 400);
	}
	if (typeof suggestion !== "string" || suggestion.trim().length === 0) return json({ error: "Nothing to send." }, 400);
	suggestion.trim().slice(0, MAX_LENGTH);
	console.error("Missing RESEND_API_KEY or SUGGESTION_FROM.");
	return json({ error: "Suggestions are not configured right now." }, 500);
};
function json(payload, status) {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region \0virtual:astro:page:src/pages/api/suggest@_@ts
var page = () => suggest_exports;
//#endregion
export { page };
